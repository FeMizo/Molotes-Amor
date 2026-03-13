import { PRODUCT_SEED } from "@/data/products";
import type {
  AccountDirectoryEntry,
  AdminUserSummary,
  UserAccountProfile,
  UserPanelOrder,
} from "@/types/account";
import type { OrderItem, OrderStatus } from "@/types/order";

const productMap = new Map(PRODUCT_SEED.map((product) => [product.id, product]));

const createOrderItems = (
  lines: Array<{ productId: string; quantity: number }>,
): OrderItem[] =>
  lines.map(({ productId, quantity }) => {
    const product = productMap.get(productId);
    if (!product) {
      throw new Error(`Producto faltante para mock order: ${productId}`);
    }

    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

const createOrder = ({
  id,
  status,
  createdAt,
  customer,
  lines,
  notes,
  etaLabel,
  trackingNote,
  channel,
  source = "mock",
}: {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string; address?: string };
  lines: Array<{ productId: string; quantity: number }>;
  notes?: string;
  etaLabel?: string;
  trackingNote: string;
  channel: "pickup" | "delivery";
  source?: "mock" | "checkout";
}): UserPanelOrder => {
  const items = createOrderItems(lines);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id,
    createdAt,
    customer,
    items,
    subtotal: total,
    total,
    status,
    notes,
    etaLabel,
    trackingNote,
    channel,
    source,
  };
};

const createProfile = (
  base: Partial<UserAccountProfile> & Pick<UserAccountProfile, "id" | "email">,
): UserAccountProfile => ({
  firstName: "Sofia",
  lastName: "Herrera",
  phone: "2221234567",
  memberSince: "2025-10-04T18:00:00.000Z",
  preferredContact: "whatsapp",
  marketingOptIn: true,
  passwordUpdatedAt: "2026-02-18T09:30:00.000Z",
  addresses: [
    {
      id: `${base.id}-addr-1`,
      label: "Casa",
      recipient: "Sofia Herrera",
      phone: "2221234567",
      line1: "Av. Reforma 123, Centro Historico",
      city: "Puebla, Pue.",
      reference: "Porton verde junto a la farmacia",
      isDefault: true,
    },
    {
      id: `${base.id}-addr-2`,
      label: "Oficina",
      recipient: "Sofia Herrera",
      phone: "2221234567",
      line1: "11 Sur 204, Col. El Carmen",
      line2: "Piso 2, recepcion",
      city: "Puebla, Pue.",
      isDefault: false,
    },
  ],
  ...base,
});

export const primaryAccountProfile: UserAccountProfile = createProfile({
  id: "usr-sofia",
  email: "sofia@molotesamor.mx",
});

export const primaryAccountOrders: UserPanelOrder[] = [
  createOrder({
    id: "ord-24031",
    createdAt: "2026-03-12T18:40:00.000Z",
    status: "en-camino",
    customer: {
      name: "Sofia Herrera",
      phone: "2221234567",
      address: "Av. Reforma 123, Centro Historico",
    },
    channel: "delivery",
    etaLabel: "12 a 18 min",
    trackingNote: "El repartidor va saliendo de cocina con tu pedido.",
    lines: [
      { productId: "1", quantity: 2 },
      { productId: "4", quantity: 1 },
    ],
    notes: "Sin cebolla extra.",
  }),
  createOrder({
    id: "ord-23984",
    createdAt: "2026-03-04T15:10:00.000Z",
    status: "entregado",
    customer: {
      name: "Sofia Herrera",
      phone: "2221234567",
      address: "11 Sur 204, Col. El Carmen",
    },
    channel: "pickup",
    etaLabel: "Recogido en 18 min",
    trackingNote: "Pedido recogido en mostrador sin incidencias.",
    lines: [
      { productId: "2", quantity: 1 },
      { productId: "6", quantity: 2 },
    ],
  }),
  createOrder({
    id: "ord-23921",
    createdAt: "2026-02-24T13:20:00.000Z",
    status: "cancelado",
    customer: {
      name: "Sofia Herrera",
      phone: "2221234567",
    },
    channel: "pickup",
    trackingNote: "Se cancelo por cambio de horario del cliente.",
    lines: [{ productId: "5", quantity: 3 }],
    notes: "Mover a la tarde si hay espacio.",
  }),
];

export const accountDirectorySeed: AccountDirectoryEntry[] = [
  {
    profile: primaryAccountProfile,
    orders: primaryAccountOrders,
  },
  {
    profile: createProfile({
      id: "usr-marco",
      email: "marco@molotesamor.mx",
      firstName: "Marco",
      lastName: "Delgado",
      phone: "2223344556",
      preferredContact: "telefono",
      marketingOptIn: false,
    }),
    orders: [
      createOrder({
        id: "ord-23810",
        createdAt: "2026-03-11T20:05:00.000Z",
        status: "pendiente",
        customer: {
          name: "Marco Delgado",
          phone: "2223344556",
          address: "25 Oriente 88, Col. El Mirador",
        },
        channel: "delivery",
        etaLabel: "25 min",
        trackingNote: "Esperando confirmacion de cocina por alta demanda.",
        lines: [
          { productId: "3", quantity: 2 },
          { productId: "1", quantity: 1 },
        ],
      }),
      createOrder({
        id: "ord-23677",
        createdAt: "2026-02-28T19:00:00.000Z",
        status: "entregado",
        customer: {
          name: "Marco Delgado",
          phone: "2223344556",
          address: "25 Oriente 88, Col. El Mirador",
        },
        channel: "delivery",
        trackingNote: "Entrega completa con pago contra entrega.",
        lines: [{ productId: "2", quantity: 4 }],
      }),
    ],
  },
  {
    profile: createProfile({
      id: "usr-elena",
      email: "elena@molotesamor.mx",
      firstName: "Elena",
      lastName: "Castillo",
      phone: "2219988776",
      preferredContact: "email",
      addresses: [],
    }),
    orders: [
      createOrder({
        id: "ord-23742",
        createdAt: "2026-03-09T14:45:00.000Z",
        status: "preparando",
        customer: {
          name: "Elena Castillo",
          phone: "2219988776",
        },
        channel: "pickup",
        etaLabel: "8 min",
        trackingNote: "La masa ya esta entrando al punto final de fritura.",
        lines: [
          { productId: "4", quantity: 2 },
          { productId: "5", quantity: 1 },
        ],
      }),
    ],
  },
];

export const adminUserSummarySeed: AdminUserSummary[] = accountDirectorySeed.map(
  ({ profile, orders }) => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrderCount = orders.filter(
      (order) => order.status !== "entregado" && order.status !== "cancelado",
    ).length;

    return {
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      phone: profile.phone,
      preferredContact: profile.preferredContact,
      totalOrders: orders.length,
      totalSpent,
      activeOrderCount,
      hasAddress: profile.addresses.length > 0,
      lastOrderAt: orders[0]?.createdAt,
      tags: [
        profile.marketingOptIn ? "marketing" : "sin marketing",
        activeOrderCount > 0 ? "activo" : "en pausa",
      ],
    };
  },
);
