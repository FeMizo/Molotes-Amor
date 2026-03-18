"use client";

import { useCallback, useEffect, useState } from "react";

import {
  adminClient,
  type CreateComboPayload,
  type UpdateComboPayload,
} from "@/services/client/admin-client";
import type { Combo } from "@/types/combo";

export const useAdminCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCombos(await adminClient.listCombos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los combos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createCombo = async (payload: CreateComboPayload) => {
    const created = await adminClient.createCombo(payload);
    setCombos((prev) => [...prev, created].sort((left, right) => left.order - right.order));
  };

  const updateCombo = async (id: string, payload: UpdateComboPayload) => {
    const updated = await adminClient.updateCombo(id, payload);
    setCombos((prev) =>
      prev
        .map((combo) => (combo.id === id ? updated : combo))
        .sort((left, right) => left.order - right.order),
    );
  };

  const deleteCombo = async (id: string) => {
    await adminClient.deleteCombo(id);
    setCombos((prev) => prev.filter((combo) => combo.id !== id));
  };

  return {
    combos,
    loading,
    error,
    reload: load,
    createCombo,
    updateCombo,
    deleteCombo,
  };
};
