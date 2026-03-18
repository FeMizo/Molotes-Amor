import type { Order, OrderPayment, OrderPaymentMethod } from "@/types/order";
import type { OperationsContent } from "@/types/site-content";

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

export const buildTransferReference = (orderId: string): string => orderId.toUpperCase();

export const getOrderPayment = (order: Pick<Order, "payment">): OrderPayment => ({
  method: "efectivo",
  ...(order.payment ?? {}),
});

export const getOrderPaymentMethod = (order: Pick<Order, "payment">): OrderPaymentMethod =>
  getOrderPayment(order).method;
