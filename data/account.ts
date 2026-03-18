import { PRODUCT_SEED } from "@/data/products";
import type { AppUser } from "@/types/auth";
import type { AdminUserSummary } from "@/types/account";
import type { Order, OrderItem, OrderStatus } from "@/types/order";

const productMap = new Map(PRODUCT_SEED.map((product) => [product.id, product]));

const createOrderItems = (
  lines: Array<{ productId: string; quantity: number }>,
): OrderItem[] =>
  lines.map(({ productId, quantity }) => {
    const product = productMap.get(productId);
    if (!product) {
      throw new Error(`Producto faltante para seed order: ${productId}`);
    }

    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

const createUser = (input: {
  id: string;
  username: string;
  password: string;
  role: AppUser["role"];
  isActive?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: AppUser["preferredContact"];
  addresses: AppUser["addresses"];
}): AppUser => ({
  ...input,
  memberSince: "2026-01-08T13:00:00.000Z",
  marketingOptIn: true,
  passwordUpdatedAt: "2026-03-10T09:00:00.000Z",
  isActive: input.isActive ?? true,
});

export const authUserSeed: AppUser[] = [
  createUser({
    id: "usr-admin-molotes",
    username: "adminmolotes",
    password: "molotesamor",
    role: "admin",
    firstName: "Admin",
    lastName: "Molotes",
    email: "admin@molotesamor.mx",
    phone: "2220000000",
    preferredContact: "email",
    addresses: [],
  }),
  createUser({
    id: "usr-juan-perez",
    username: "juantest1",
    password: "juantest1",
    role: "user",
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@molotesamor.mx",
    phone: "2221234588",
    preferredContact: "whatsapp",
    addresses: [
      {
        id: "usr-juan-perez-addr-1",
        label: "Casa",
        recipient: "Juan Perez",
        phone: "2221234588",
        line1: "Av. Reforma 123, Centro Historico",
        city: "Puebla, Pue.",
        reference: "Puerta color vino",
        isDefault: true,
      },
    ],
  }),
  createUser({
    id: "usr-vita",
    username: "vitaprueba1",
    password: "vitaprueba1",
    role: "user",
    firstName: "Vita",
    lastName: "",
    email: "vita@molotesamor.mx",
    phone: "2217654321",
    preferredContact: "email",
    addresses: [
      {
        id: "usr-vita-addr-1",
        label: "Depto",
        recipient: "Vita",
        phone: "2217654321",
        line1: "11 Sur 204, Col. El Carmen",
        line2: "Depto 3B",
        city: "Puebla, Pue.",
        reference: "Porton gris",
        isDefault: true,
      },
    ],
  }),
];

const createOrder = ({
  id,
  userId,
  userUsername,
  status,
  createdAt,
  customer,
  lines,
  notes,
}: {
  id: string;
  userId: string;
  userUsername: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string; address?: string };
  lines: Array<{ productId: string; quantity: number }>;
  notes?: string;
}): Order => {
  const items = createOrderItems(lines);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id,
    userId,
    userUsername,
    items,
    subtotal: total,
    total,
    status,
    createdAt,
    customer,
    notes,
  };
};

export const seedUserOrders: Order[] = [
  createOrder({
    id: "ord-juan-001",
    userId: "usr-juan-perez",
    userUsername: "juantest1",
    status: "preparando",
    createdAt: "2026-03-11T18:20:00.000Z",
    customer: {
      name: "Juan Perez",
      phone: "2221234588",
      address: "Av. Reforma 123, Centro Historico",
    },
    lines: [
      { productId: "1", quantity: 2 },
      { productId: "3", quantity: 1 },
    ],
    notes: "Agregar salsa aparte.",
  }),
  createOrder({
    id: "ord-vita-001",
    userId: "usr-vita",
    userUsername: "vitaprueba1",
    status: "confirmado",
    createdAt: "2026-03-10T13:10:00.000Z",
    customer: {
      name: "Vita",
      phone: "2217654321",
      address: "11 Sur 204, Col. El Carmen",
    },
    lines: [
      { productId: "4", quantity: 2 },
      { productId: "6", quantity: 1 },
    ],
    notes: "Avisar por correo cuando salga.",
  }),
];

export const adminUserSummarySeed: AdminUserSummary[] = authUserSeed
  .filter((user) => user.role === "user")
  .map((user) => {
  const orders = seedUserOrders.filter((order) => order.userId === user.id);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrderCount = orders.filter(
    (order) => order.status !== "entregado" && order.status !== "cancelado",
  ).length;

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    phone: user.phone,
    preferredContact: user.preferredContact,
    role: user.role,
    isActive: user.isActive,
    totalOrders: orders.length,
    totalSpent,
    activeOrderCount,
    hasAddress: user.addresses.length > 0,
    lastOrderAt: orders[0]?.createdAt,
    tags: [
      "usuario-prueba",
      activeOrderCount > 0 ? "activo" : "sin flujo",
    ],
  };
});
