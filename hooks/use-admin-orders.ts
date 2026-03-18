"use client";

import { useCallback, useEffect, useState } from "react";

import { adminClient } from "@/services/client/admin-client";
import { getOrderPayment } from "@/lib/payment";
import type { Order, OrderStatus } from "@/types/order";

const normalizeOrder = (order: Order): Order => ({
  ...order,
  payment: getOrderPayment(order),
});

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders((await adminClient.listOrders()).map(normalizeOrder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const updated = normalizeOrder(await adminClient.updateOrderStatus(id, status));
    setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
  };

  return { orders, loading, error, reload: load, updateStatus };
};
