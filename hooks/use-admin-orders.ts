"use client";

import { useCallback, useEffect, useState } from "react";

import { adminClient } from "@/services/client/admin-client";
import { ensureOrdersHavePaymentRefs, getOrderPayment } from "@/lib/payment";
import type { Order, OrderStatus } from "@/types/order";

const normalizeOrder = (order: Order): Order => ({
  ...order,
  payment: getOrderPayment(order),
});

const normalizeOrders = (orders: Order[]): Order[] =>
  ensureOrdersHavePaymentRefs(orders).orders.map(normalizeOrder);

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(normalizeOrders(await adminClient.listOrders()));
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
    const updated = normalizeOrders([await adminClient.updateOrderStatus(id, status)])[0];
    setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
  };

  return { orders, loading, error, reload: load, updateStatus };
};
