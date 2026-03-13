"use client";

import { useMemo } from "react";

import { primaryAccountOrders } from "@/data/account";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import {
  buildUserDashboardStats,
  findUserOrderById,
  mergeUserOrders,
} from "@/services/account/account.service";
import { useAccountStore } from "@/store/account-store";

export const useUserAccount = () => {
  const profile = useAccountStore((state) => state.profile);
  const trackedOrders = useAccountStore((state) => state.trackedOrders);
  const favoriteProductIds = useAccountStore((state) => state.favoriteProductIds);
  const updateProfile = useAccountStore((state) => state.updateProfile);
  const saveAddress = useAccountStore((state) => state.saveAddress);
  const removeAddress = useAccountStore((state) => state.removeAddress);
  const markPasswordChanged = useAccountStore((state) => state.markPasswordChanged);
  const rememberOrder = useAccountStore((state) => state.rememberOrder);
  const toggleFavorite = useAccountStore((state) => state.toggleFavorite);
  const { products } = useCatalogProducts();

  const orders = useMemo(
    () => mergeUserOrders(primaryAccountOrders, trackedOrders),
    [trackedOrders],
  );
  const stats = useMemo(
    () => buildUserDashboardStats(orders, favoriteProductIds.length),
    [favoriteProductIds.length, orders],
  );
  const activeOrder = useMemo(
    () =>
      orders.find(
        (order) => order.status !== "entregado" && order.status !== "cancelado",
      ),
    [orders],
  );
  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteProductIds.includes(product.id)),
    [favoriteProductIds, products],
  );

  return {
    profile,
    orders,
    stats,
    activeOrder,
    recentOrders: orders.slice(0, 3),
    favoriteProductIds,
    favoriteProducts,
    updateProfile,
    saveAddress,
    removeAddress,
    markPasswordChanged,
    rememberOrder,
    toggleFavorite,
    findOrderById: (orderId: string) => findUserOrderById(orders, orderId),
  };
};
