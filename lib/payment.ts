import type { Order, OrderPayment, OrderPaymentMethod } from "@/types/order";
import type { OperationsContent } from "@/types/site-content";

type PaymentRefSource = Pick<Order, "id" | "createdAt" | "paymentRef" | "payment">;

const paymentRefPattern = /^\d{3}$/;

export const paymentMethodLabel: Record<OrderPaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

export const isTransferConfigReady = (operations: OperationsContent): boolean =>
  Boolean(
    operations.transferBank.trim() &&
      operations.transferAccountHolder.trim() &&
      (operations.transferClabe.trim() || operations.transferAccountNumber.trim()),
  );

export const formatPaymentRef = (value: number | string): string =>
  String(value).replace(/\D/g, "").slice(-3).padStart(3, "0");

export const isValidPaymentRef = (value: string | undefined | null): value is string =>
  Boolean(value && paymentRefPattern.test(value));

const getOrderDayKey = (createdAt: string): string => createdAt.slice(0, 10);

const extractPreferredPaymentRef = (order: PaymentRefSource): string | null => {
  if (isValidPaymentRef(order.paymentRef)) {
    return order.paymentRef;
  }

  const transferDigits = order.payment?.transferReference?.match(/(\d{3})$/)?.[1];
  if (isValidPaymentRef(transferDigits)) {
    return transferDigits;
  }

  const idDigits = order.id.replace(/\D/g, "");
  if (idDigits.length > 0) {
    return formatPaymentRef(idDigits);
  }

  const createdDigits = order.createdAt.replace(/\D/g, "");
  return createdDigits.length > 0 ? formatPaymentRef(createdDigits) : null;
};

const reserveAvailablePaymentRef = (
  preferredRef: string | null,
  usedRefs: Set<string>,
  fallbackSeed: string,
): string => {
  const firstCandidate = preferredRef ?? formatPaymentRef(fallbackSeed);

  for (let offset = 0; offset < 1000; offset += 1) {
    const nextValue = (Number(firstCandidate) + offset) % 1000;
    const candidate = formatPaymentRef(nextValue);

    if (!usedRefs.has(candidate)) {
      usedRefs.add(candidate);
      return candidate;
    }
  }

  throw new Error("No hay referencias de pago disponibles para este dia.");
};

export const generatePaymentRef = (
  order: Pick<Order, "id" | "createdAt">,
  existingOrders: Array<Pick<Order, "id" | "createdAt" | "paymentRef" | "payment">>,
): string => {
  const dayKey = getOrderDayKey(order.createdAt);
  const usedRefs = new Set(
    existingOrders
      .filter((candidate) => getOrderDayKey(candidate.createdAt) === dayKey)
      .map((candidate) => extractPreferredPaymentRef(candidate))
      .filter((candidate): candidate is string => Boolean(candidate)),
  );

  return reserveAvailablePaymentRef(
    extractPreferredPaymentRef({
      ...order,
      paymentRef: "",
      payment: undefined,
    }),
    usedRefs,
    `${Date.now()}`,
  );
};

export const ensureOrdersHavePaymentRefs = <T extends PaymentRefSource>(
  orders: T[],
): { orders: Array<T & { paymentRef: string; payment: OrderPayment }>; changed: boolean } => {
  const usedByDay = new Map<string, Set<string>>();
  const sorted = [...orders].sort((left, right) => {
    const dateDiff = +new Date(left.createdAt) - +new Date(right.createdAt);
    return dateDiff !== 0 ? dateDiff : left.id.localeCompare(right.id);
  });
  const refsById = new Map<string, string>();

  for (const order of sorted) {
    const dayKey = getOrderDayKey(order.createdAt);
    const usedRefs = usedByDay.get(dayKey) ?? new Set<string>();
    usedByDay.set(dayKey, usedRefs);

    refsById.set(
      order.id,
      reserveAvailablePaymentRef(
        extractPreferredPaymentRef(order),
        usedRefs,
        `${order.createdAt}-${order.id}`,
      ),
    );
  }

  let changed = false;
  const normalizedOrders = orders.map((order) => {
    const paymentRef = refsById.get(order.id) ?? formatPaymentRef(order.id);
    const currentPayment = getOrderPayment({
      payment: order.payment,
      paymentRef,
    });
    const nextPayment =
      currentPayment.method === "transferencia"
        ? {
            ...currentPayment,
            transferReference: paymentRef,
          }
        : currentPayment;

    if (
      order.paymentRef !== paymentRef ||
      order.payment?.method !== nextPayment.method ||
      order.payment?.transferReference !== nextPayment.transferReference
    ) {
      changed = true;
    }

    return {
      ...order,
      paymentRef,
      payment: nextPayment,
    };
  });

  return {
    orders: normalizedOrders,
    changed,
  };
};

export const getOrderPayment = (
  order: Pick<Order, "payment" | "paymentRef">,
): OrderPayment => {
  const basePayment = {
    method: "efectivo" as OrderPaymentMethod,
    ...(order.payment ?? {}),
  };

  if (basePayment.method !== "transferencia") {
    return {
      ...basePayment,
      transferReference: undefined,
    };
  }

  return {
    ...basePayment,
    transferReference: getOrderPaymentRef(order),
  };
};

export const getOrderPaymentMethod = (
  order: Pick<Order, "payment" | "paymentRef">,
): OrderPaymentMethod => getOrderPayment(order).method;

export const getOrderPaymentRef = (
  order: Pick<Order, "paymentRef" | "payment">,
): string =>
  isValidPaymentRef(order.paymentRef)
    ? order.paymentRef
    : extractPreferredPaymentRef({
        id: "",
        createdAt: new Date().toISOString(),
        paymentRef: order.paymentRef,
        payment: order.payment,
      }) ?? "000";
