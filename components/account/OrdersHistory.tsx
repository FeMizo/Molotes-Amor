"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatCurrency, formatDate } from "@/lib/format";
import { adminOrderStatuses } from "@/lib/order-status";
import { useUserAccount } from "@/hooks/use-user-account";
import type { OrderStatus } from "@/types/order";

import { AccountEmptyState } from "./AccountEmptyState";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";

export const OrdersHistory = () => {
  const { orders } = useUserAccount();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "todos">("todos");

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${order.id} ${order.items.map((item) => item.productName).join(" ")} ${order.status}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  if (orders.length === 0) {
    return (
      <AccountEmptyState
        title="Todavia no hay historial"
        description="Cuando completes pedidos, aqui veras numero de orden, fecha, total, estado y acceso al detalle."
      />
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Historial
            </p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
              Todos tus pedidos
            </h2>
            <p className="mt-2 text-sepia/65">
              Busca por numero de pedido, producto o estado.
            </p>
          </div>
          <div className="w-full lg:max-w-sm">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por pedido, producto o estado"
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
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
      </article>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-[2rem] border border-beige-tostado/30 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-serif font-bold text-sepia">{order.id}</h3>
                  <OrderStatusBadge status={order.status} compact />
                </div>
                <p className="text-sm text-sepia/60">
                  {formatDate(order.createdAt)} · {formatCurrency(order.total)}
                </p>
                <p className="text-sm text-sepia/75">
                  {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(" · ")}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <p className="max-w-sm text-sm text-sepia/65">{order.trackingNote}</p>
                <Link
                  href={`/mi-cuenta/pedidos/${order.id}`}
                  className="inline-flex rounded-xl border border-beige-tostado/35 px-4 py-3 font-bold text-sepia transition-colors hover:border-terracota"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <AccountEmptyState
          title="No encontramos pedidos con ese filtro"
          description="Prueba con otro estado o limpia el texto de busqueda para volver a ver tu historial completo."
          ctaHref="/mi-cuenta/pedidos"
          ctaLabel="Limpiar filtro"
        />
      ) : null}
    </div>
  );
};
