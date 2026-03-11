"use client";

import { useCallback, useEffect, useState } from "react";

import { adminClient, type InventoryRow } from "@/services/client/admin-client";

export const useAdminInventory = () => {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminClient.listInventory());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = async (payload: {
    productId: string;
    stock: number;
    minStock?: number;
    allowBackorder: boolean;
    available?: boolean;
  }) => {
    const updated = await adminClient.updateInventory(payload);
    setRows(updated);
  };

  return { rows, loading, error, reload: load, updateRow };
};
