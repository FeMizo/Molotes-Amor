"use client";

import { useMemo } from "react";

import { listAdminUsers } from "@/services/account/account.service";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useAuthStore } from "@/store/auth-store";
import type { AppUser } from "@/types/auth";

export const useAdminUsers = () => {
  const usersSeed = useAuthStore((state) => state.users);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { orders, loading, error } = useAdminOrders();

  const users = useMemo(() => listAdminUsers(usersSeed, orders), [orders, usersSeed]);

  const saveUser = (userId: string, patch: Partial<AppUser>) => {
    updateUser(userId, (user) => ({
      ...user,
      ...patch,
      addresses: patch.addresses ?? user.addresses,
      password: patch.password ?? user.password,
      memberSince: patch.memberSince ?? user.memberSince,
      passwordUpdatedAt: patch.passwordUpdatedAt ?? user.passwordUpdatedAt,
    }));
  };

  return {
    users,
    loading,
    error,
    saveUser,
  };
};
