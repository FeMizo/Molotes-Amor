"use client";

import { useMemo, useState } from "react";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { adminOrderStatuses } from "@/lib/order-status";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import type { OrderStatus } from "@/types/order";

import { OrderStatusBadge } from "../orders/OrderStatusBadge";

export const AdminOrdersManager = () => {
  const { orders, loading, error, updateStatus } = useAdminOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "todos">("todos");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const target =
        `${order.id} ${order.userUsername ?? ""} ${order.customer.name} ${order.customer.phone} ${order.status} ${order.items
          .map((item) => item.productName)
          .join(" ")}`.toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 || target.includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0];
  const pendingOrders = orders.filter((order) => order.status === "pendiente").length;
  const inKitchenOrders = orders.filter(
    (order) => order.status === "confirmado" || order.status === "preparando",
  ).length;
  const onRouteOrders = orders.filter((order) => order.status === "en-camino").length;

  const changeStatus = async (id: string, status: OrderStatus) => {
    setFeedback(null);
    setFeedbackError(null);

    try {
      await updateStatus(id, status);
      setFeedback("Estado actualizado.");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "No se pudo actualizar estado.");
    }
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Pedidos
            </p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
              Flujo operativo de pedidos
            </h2>
            <p className="mt-2 text-sepia/65">
              Filtra por estado, busca por cliente y actualiza el flujo sin saturar una sola vista.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Total pedidos</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{orders.length}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Pendientes</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{pendingOrders}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">En cocina</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{inKitchenOrders}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">En camino</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{onRouteOrders}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por id, cliente, telefono o producto"
            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("todos")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                statusFilter === "todos"
                  ? "border-terracota bg-terracota text-crema"
                  : "border-beige-tostado/30 bg-crema text-sepia"
              }`}
            >
              Todos
            </button>
            {adminOrderStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  statusFilter === status
                    ? "border-terracota bg-terracota text-crema"
                    : "border-beige-tostado/30 bg-crema text-sepia"
                }`}
              >
                {status.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_1.25fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-sepia">Cola de pedidos</h3>
            <span className="text-sm text-sepia/70">
              {loading ? "Cargando..." : `${filteredOrders.length} visibles`}
            </span>
          </div>
          {error ? <p className="mb-3 font-semibold text-rojo-quemado">{error}</p> : null}
          <div className="space-y-3 max-h-[720px] overflow-auto pr-1">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedOrder?.id === order.id
                    ? "border-terracota bg-crema"
                    : "border-beige-tostado/25 hover:border-beige-tostado/60"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sepia">{order.id}</p>
                    <p className="mt-1 text-sm text-sepia/60">{order.customer.name}</p>
                    <p className="text-xs text-sepia/50">
                      {order.userUsername ? `Usuario: ${order.userUsername}` : "Sin usuario"}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} compact />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-sepia/60">{order.items.length} items</span>
                  <span className="font-bold text-terracota">{formatCurrency(order.total)}</span>
                </div>
              </button>
            ))}
            {!loading && filteredOrders.length === 0 ? (
              <p className="rounded-2xl bg-crema px-4 py-8 text-center text-sepia/60">
                No hay pedidos con ese filtro.
              </p>
            ) : null}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          {!selectedOrder ? (
            <p className="rounded-2xl bg-crema px-4 py-8 text-center text-sepia/60">
              Selecciona un pedido para ver su detalle operativo.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-sepia">
                    {selectedOrder.id}
                  </h2>
                  <p className="mt-2 text-sepia/65">
                    Cliente: {selectedOrder.customer.name}
                  </p>
                  <p className="text-sm text-sepia/55">
                    Usuario: {selectedOrder.userUsername ?? "Sin usuario vinculado"}
                  </p>
                  <p className="text-sm text-sepia/55">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="space-y-3">
                  <OrderStatusBadge status={selectedOrder.status} />
                  <select
                    value={selectedOrder.status}
                    onChange={(event) =>
                      void changeStatus(
                        selectedOrder.id,
                        event.target.value as OrderStatus,
                      )
                    }
                    className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                  >
                    {adminOrderStatuses.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {feedback ? <p className="font-semibold text-olivo">{feedback}</p> : null}
              {feedbackError ? <p className="font-semibold text-rojo-quemado">{feedbackError}</p> : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-crema p-4">
                  <h3 className="font-bold text-sepia">Cliente</h3>
                  <p className="mt-2 text-sepia/80">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-sepia/70">{selectedOrder.customer.phone}</p>
                  <p className="mt-1 text-sm text-sepia/70">
                    {selectedOrder.customer.address ?? "Sin direccion"}
                  </p>
                </div>
                <div className="rounded-2xl bg-crema p-4">
                  <h3 className="font-bold text-sepia">Resumen</h3>
                  <p className="mt-2 text-sepia/80">Subtotal: {formatCurrency(selectedOrder.subtotal)}</p>
                  <p className="text-sepia/80">Total: {formatCurrency(selectedOrder.total)}</p>
                  <p className="text-sepia/80">Items: {selectedOrder.items.length}</p>
                </div>
              </div>

              {selectedOrder.notes ? (
                <div className="rounded-2xl bg-crema p-4">
                  <h3 className="font-bold text-sepia">Notas</h3>
                  <p className="mt-2 text-sepia/80">{selectedOrder.notes}</p>
                </div>
              ) : null}

              <div>
                <h3 className="mb-3 font-bold text-sepia">Items del pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={`${selectedOrder.id}-${item.productId}`}
                      className="flex justify-between border-b border-beige-tostado/20 pb-2"
                    >
                      <p className="text-sepia">
                        {item.quantity} x {item.productName}
                      </p>
                      <p className="font-semibold text-terracota">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
