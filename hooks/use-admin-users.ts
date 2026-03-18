"use client";

import { useMemo } from "react";

import { assertValidEmail, assertValidPhone } from "@/lib/contact";
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
    const nextPatch = { ...patch };

    if (patch.email !== undefined) {
      nextPatch.email = assertValidEmail(patch.email);
    }

    if (patch.phone !== undefined) {
      nextPatch.phone = assertValidPhone(patch.phone, "Ingresa un telefono valido.");
    }

    updateUser(userId, (user) => ({
      ...user,
      ...nextPatch,
      addresses: nextPatch.addresses ?? user.addresses,
      password: nextPatch.password ?? user.password,
      memberSince: nextPatch.memberSince ?? user.memberSince,
      passwordUpdatedAt: nextPatch.passwordUpdatedAt ?? user.passwordUpdatedAt,
    }));
  };

  return {
    users,
    loading,
    error,
    saveUser,
  };
};
