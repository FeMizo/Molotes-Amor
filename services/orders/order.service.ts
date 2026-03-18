import { getRepositories } from "@/repositories/local-repositories";
import { getSiteContent } from "@/services/content/site-content.service";
import { assertValidEmail, assertValidPhone } from "@/lib/contact";
import {
  ensureOrdersHavePaymentRefs,
  generatePaymentRef,
  isTransferConfigReady,
} from "@/lib/payment";
import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";

const toOrderId = (): string => `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const repos = getRepositories();
  const siteContent = await getSiteContent();
  const [products, inventory, existingOrders] = await Promise.all([
    repos.products.list(),
    repos.inventory.list(),
    repos.orders.list(),
  ]);
  const orderId = toOrderId();
  const createdAt = new Date().toISOString();

  if (input.items.length === 0) {
    throw new Error("El pedido no tiene productos.");
  }

  if (!siteContent.operations.isOrderingEnabled) {
    throw new Error(siteContent.operations.checkoutMessage);
  }

  const paymentMethod = input.payment?.method ?? "efectivo";

  const customerEmail = assertValidEmail(
    input.customer.email,
    "Ingresa un correo valido para tu pedido.",
  );
  const customerPhone = assertValidPhone(
    input.customer.phone,
    "Ingresa un telefono valido de 10 a 15 digitos.",
  );

  if (paymentMethod === "transferencia" && !isTransferConfigReady(siteContent.operations)) {
    throw new Error("La configuracion de transferencia no esta completa en admin.");
  }

  const orderItems = input.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      throw new Error("Producto no encontrado en catalogo.");
    }

    const stock = inventory.find((record) => record.productId === product.id);
    if (!stock) {
      throw new Error(`Inventario faltante para ${product.name}.`);
    }

    if (!stock.allowBackorder && item.quantity > stock.stock) {
      throw new Error(`Stock insuficiente para ${product.name}.`);
    }

    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
      stockInfo: stock,
    };
  });

  for (const item of orderItems) {
    if (!item.stockInfo.allowBackorder) {
      await repos.inventory.adjustStock(item.productId, -item.quantity);
    }
  }

  const paymentRef = generatePaymentRef(
    { id: orderId, createdAt },
    ensureOrdersHavePaymentRefs(existingOrders).orders,
  );
  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const order: Order = {
    id: orderId,
    paymentRef,
    items: orderItems.map(({ stockInfo: _stockInfo, ...item }) => item),
    subtotal,
    total: subtotal,
    status: "pendiente",
    createdAt,
    userId: input.account.userId,
    userUsername: input.account.username,
    customer: {
      ...input.customer,
      email: customerEmail,
      phone: customerPhone,
    },
    payment:
      paymentMethod === "transferencia"
        ? {
            method: "transferencia",
            transferReference: paymentRef,
            bank: siteContent.operations.transferBank,
            accountHolder: siteContent.operations.transferAccountHolder,
            accountNumber: siteContent.operations.transferAccountNumber,
            clabe: siteContent.operations.transferClabe,
          }
        : {
            method: "efectivo",
          },
    notes: input.notes,
  };

  return repos.orders.create(order);
};

export const listOrders = async (): Promise<Order[]> => {
  const repos = getRepositories();
  return ensureOrdersHavePaymentRefs(await repos.orders.list()).orders;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const repos = getRepositories();
  return repos.orders.updateStatus(id, status);
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  const repos = getRepositories();
  const order = await repos.orders.findById(id);
  if (!order) {
    return undefined;
  }

  return ensureOrdersHavePaymentRefs([order]).orders[0];
};
