"use client";

import { useCallback, useEffect, useState } from "react";

import { adminClient, type CreateProductPayload, type ProductWithInventoryResponse, type UpdateProductPayload } from "@/services/client/admin-client";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<ProductWithInventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await adminClient.listProducts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createProduct = async (payload: CreateProductPayload) => {
    const created = await adminClient.createProduct(payload);
    setProducts((prev) => [created, ...prev]);
  };

  const updateProduct = async (id: string, payload: UpdateProductPayload) => {
    const updated = await adminClient.updateProduct(id, payload);
    setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const deleteProduct = async (id: string) => {
    await adminClient.deleteProduct(id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    products,
    loading,
    error,
    reload: load,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
