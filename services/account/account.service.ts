import type { AppUser } from "@/types/auth";
import type {
  AdminUserSummary,
  UserDashboardStats,
  UserPanelOrder,
} from "@/types/account";
import type { Order } from "@/types/order";

const sortOrdersByDate = (orders: UserPanelOrder[]): UserPanelOrder[] =>
  [...orders].sort(
    (left, right) => +new Date(right.createdAt) - +new Date(left.createdAt),
  );

export const toUserPanelOrder = (order: Order): UserPanelOrder => {
  const delivery = Boolean(order.customer.address);
  const etaLabel =
    order.status === "entregado" || order.status === "cancelado"
      ? undefined
      : delivery
        ? "20 a 30 min"
        : "12 a 18 min";

  return {
    ...order,
    source: order.id.startsWith("ord-juan") || order.id.startsWith("ord-vita")
      ? "mock"
      : "checkout",
    channel: delivery ? "delivery" : "pickup",
    etaLabel,
    trackingNote:
      order.status === "pendiente"
        ? "Recibimos tu pedido y estamos confirmando el flujo en cocina."
        : order.status === "confirmado"
          ? "Tu pedido ya fue confirmado. Pronto avanzara a preparacion."
          : order.status === "preparando"
            ? "La cocina ya esta trabajando en tu orden."
            : order.status === "en-camino"
              ? "Tu pedido va saliendo hacia entrega o punto de encuentro."
              : order.status === "entregado"
                ? "Pedido finalizado correctamente."
                : "Este pedido fue cancelado.",
  };
};

export const buildUserDashboardStats = (
  orders: UserPanelOrder[],
  favoriteCount: number,
): UserDashboardStats => ({
  totalOrders: orders.length,
  activeOrders: orders.filter(
    (order) => order.status !== "entregado" && order.status !== "cancelado",
  ).length,
  totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
  favoriteCount,
  lastOrderAt: orders[0]?.createdAt,
});

export const findUserOrderById = (
  orders: UserPanelOrder[],
  orderId: string,
): UserPanelOrder | undefined => orders.find((order) => order.id === orderId);

export const buildUserOrders = (
  orders: Order[],
  userId: string | undefined,
): UserPanelOrder[] =>
  sortOrdersByDate(
    orders
      .filter((order) => Boolean(userId) && order.userId === userId)
      .map(toUserPanelOrder),
  );

export const listAdminUsers = (
  users: AppUser[],
  orders: Order[],
): AdminUserSummary[] =>
  [...users]
    .map((user) => {
      const userOrders = orders.filter((order) => order.userId === user.id);
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
      const activeOrderCount = userOrders.filter(
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
        totalOrders: userOrders.length,
        totalSpent,
        activeOrderCount,
        hasAddress: user.addresses.length > 0,
        lastOrderAt: userOrders
          .sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt))[0]
          ?.createdAt,
        tags: [
          "usuario-prueba",
          user.username,
          user.role,
          user.isActive ? "habilitado" : "inactivo",
          activeOrderCount > 0 ? "activo" : "sin flujo",
        ],
      } satisfies AdminUserSummary;
    })
    .sort((left, right) => +new Date(right.lastOrderAt ?? 0) - +new Date(left.lastOrderAt ?? 0));
