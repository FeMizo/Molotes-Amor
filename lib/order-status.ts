import type { OrderStatus } from "@/types/order";

export const activeOrderFlow: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "preparando",
  "en-camino",
  "entregado",
];

export const adminOrderStatuses: OrderStatus[] = [
  ...activeOrderFlow,
  "cancelado",
];

export const orderStatusMeta: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  pendiente: {
    label: "Pendiente",
    description: "Recibimos tu pedido y estamos validando disponibilidad.",
    badgeClassName: "bg-mostaza/20 text-canela border-mostaza/30",
  },
  confirmado: {
    label: "Confirmado",
    description: "Tu pedido ya quedo confirmado en cocina.",
    badgeClassName: "bg-sky-100 text-sky-700 border-sky-200",
  },
  preparando: {
    label: "Preparando",
    description: "La cocina ya esta trabajando en tu orden.",
    badgeClassName: "bg-orange-100 text-orange-700 border-orange-200",
  },
  "en-camino": {
    label: "En camino",
    description: "Tu pedido ya va saliendo hacia entrega o punto de encuentro.",
    badgeClassName: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  entregado: {
    label: "Entregado",
    description: "Pedido finalizado correctamente.",
    badgeClassName: "bg-olivo/15 text-olivo border-olivo/25",
  },
  cancelado: {
    label: "Cancelado",
    description: "El pedido fue cancelado y ya no sigue en flujo.",
    badgeClassName: "bg-rojo-quemado/10 text-rojo-quemado border-rojo-quemado/20",
  },
};

export const isTerminalOrderStatus = (status: OrderStatus): boolean =>
  status === "entregado" || status === "cancelado";
