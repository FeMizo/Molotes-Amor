"use client";

import { useCallback, useEffect, useState } from "react";

import { PRODUCT_SEED } from "@/data/products";
import { catalogClient } from "@/services/client/catalog-client";
import { toInventoryView } from "@/lib/inventory";
import type { CatalogProduct } from "@/types/catalog";

const fallbackProducts: CatalogProduct[] = PRODUCT_SEED.map((product) => ({
  ...product,
  inventory: toInventoryView({
    productId: product.id,
    stock: 10,
    minStock: 3,
    allowBackorder: false,
  }),
}));

export const useCatalogProducts = () => {
  const [products, setProducts] = useState<CatalogProduct[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogClient.listProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el catalogo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { products, loading, error, refresh };
};
