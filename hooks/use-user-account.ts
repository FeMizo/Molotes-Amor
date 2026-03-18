"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ensureOrdersHavePaymentRefs } from "@/lib/payment";
import { adminClient } from "@/services/client/admin-client";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import {
  buildUserDashboardStats,
  buildUserOrders,
  findUserOrderById,
} from "@/services/account/account.service";
import { useAccountStore } from "@/store/account-store";
import {
  selectCurrentUser,
  upsertUserAddress,
  useAuthStore,
} from "@/store/auth-store";
import type { UserAddress } from "@/types/account";
import type { AppUser } from "@/types/auth";
import type { Order } from "@/types/order";

type AccountProfilePatch = Partial<
  Omit<AppUser, "id" | "username" | "password" | "addresses"> & {
    addresses: UserAddress[];
  }
>;

export const useUserAccount = () => {
  const favoriteProductIds = useAccountStore((state) => state.favoriteProductIds);
  const toggleFavorite = useAccountStore((state) => state.toggleFavorite);
  const profile = useAuthStore(selectCurrentUser);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { products } = useCatalogProducts();
  const [ordersFeed, setOrdersFeed] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setOrdersFeed(ensureOrdersHavePaymentRefs(await adminClient.listOrders()).orders);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "No se pudieron cargar tus pedidos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const orders = useMemo(
    () => buildUserOrders(ordersFeed, profile?.id),
    [ordersFeed, profile?.id],
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

  const updateProfile = (patch: AccountProfilePatch) => {
    if (!profile) {
      return;
    }

    updateUser(profile.id, (user) => ({
      ...user,
      ...patch,
      addresses: patch.addresses ?? user.addresses,
    }));
  };

  const saveAddress = (address: UserAddress) => {
    if (!profile) {
      return;
    }

    updateUser(profile.id, (user) => ({
      ...user,
      addresses: upsertUserAddress(user.addresses, address),
    }));
  };

  const removeAddress = (addressId: string) => {
    if (!profile) {
      return;
    }

    updateUser(profile.id, (user) => {
      const nextAddresses = user.addresses.filter((address) => address.id !== addressId);

      return {
        ...user,
        addresses: nextAddresses.map((address, index) => ({
          ...address,
          isDefault: address.isDefault || index === 0,
        })),
      };
    });
  };

  const markPasswordChanged = () => {
    if (!profile) {
      return;
    }

    updateUser(profile.id, (user) => ({
      ...user,
      passwordUpdatedAt: new Date().toISOString(),
    }));
  };

  const changePassword = (currentPassword: string, nextPassword: string) => {
    if (!profile) {
      throw new Error("No hay una sesion activa.");
    }

    if (profile.password !== currentPassword) {
      throw new Error("La contrasena actual no coincide.");
    }

    updateUser(profile.id, (user) => ({
      ...user,
      password: nextPassword,
      passwordUpdatedAt: new Date().toISOString(),
    }));
  };

  return {
    profile,
    loading,
    error,
    isAuthenticated: Boolean(profile),
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
    changePassword,
    toggleFavorite,
    reloadOrders: loadOrders,
    findOrderById: (orderId: string) => findUserOrderById(orders, orderId),
  };
};
