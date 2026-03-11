import { getRepositories } from "@/repositories/local-repositories";
import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";

const toOrderId = (): string => `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const repos = getRepositories();
  const [products, inventory] = await Promise.all([repos.products.list(), repos.inventory.list()]);

  if (input.items.length === 0) {
    throw new Error("El pedido no tiene productos.");
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const order: Order = {
    id: toOrderId(),
    items: orderItems.map(({ stockInfo: _stockInfo, ...item }) => item),
    subtotal,
    total: subtotal,
    status: "pendiente",
    createdAt: new Date().toISOString(),
    customer: input.customer,
    notes: input.notes,
  };

  return repos.orders.create(order);
};

export const listOrders = async (): Promise<Order[]> => {
  const repos = getRepositories();
  return repos.orders.list();
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const repos = getRepositories();
  return repos.orders.updateStatus(id, status);
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  const repos = getRepositories();
  return repos.orders.findById(id);
};
