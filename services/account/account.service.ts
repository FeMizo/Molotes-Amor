import {
  accountDirectorySeed,
  adminUserSummarySeed,
  primaryAccountOrders,
  primaryAccountProfile,
} from "@/data/account";
import type {
  AdminUserSummary,
  UserAccountProfile,
  UserDashboardStats,
  UserPanelOrder,
} from "@/types/account";

const sortOrdersByDate = (orders: UserPanelOrder[]): UserPanelOrder[] =>
  [...orders].sort(
    (left, right) =>
      +new Date(right.createdAt) - +new Date(left.createdAt),
  );

export const mergeUserOrders = (
  baseOrders: UserPanelOrder[],
  trackedOrders: UserPanelOrder[],
): UserPanelOrder[] => {
  const seen = new Map<string, UserPanelOrder>();

  for (const order of [...trackedOrders, ...baseOrders]) {
    if (!seen.has(order.id)) {
      seen.set(order.id, order);
    }
  }

  return sortOrdersByDate([...seen.values()]);
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
): UserPanelOrder | undefined =>
  orders.find((order) => order.id === orderId);

export const getPrimaryAccountSeed = (): {
  profile: UserAccountProfile;
  orders: UserPanelOrder[];
} => ({
  profile: primaryAccountProfile,
  orders: sortOrdersByDate(primaryAccountOrders),
});

export const listAdminUsers = (): AdminUserSummary[] =>
  [...adminUserSummarySeed].sort(
    (left, right) =>
      +new Date(right.lastOrderAt ?? 0) - +new Date(left.lastOrderAt ?? 0),
  );

export const listAccountDirectory = () => accountDirectorySeed;
