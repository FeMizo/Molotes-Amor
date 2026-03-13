"use client";

import Link from "next/link";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { orderStatusMeta } from "@/lib/order-status";
import { useUserAccount } from "@/hooks/use-user-account";

import { AccountEmptyState } from "./AccountEmptyState";
import { RepeatOrderButton } from "./RepeatOrderButton";
import { OrderProgressTracker } from "../orders/OrderProgressTracker";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";

export const OrderDetailView = ({ orderId }: { orderId: string }) => {
  const { findOrderById } = useUserAccount();
  const order = findOrderById(orderId);

  if (!order) {
    return (
      <AccountEmptyState
        title="Ese pedido no aparece en tu panel"
        description="Puede ser un pedido aun no vinculado a esta cuenta mock o un id que ya no existe en tu historial."
        ctaHref="/mi-cuenta/pedidos"
        ctaLabel="Volver al historial"
      />
    );
  }

  const statusMeta = orderStatusMeta[order.status];

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/mi-cuenta/pedidos" className="text-sm font-bold text-terracota">
              Volver a pedidos
            </Link>
            <h2 className="mt-3 text-4xl font-serif font-bold text-sepia">
              {order.id}
            </h2>
            <p className="mt-2 max-w-2xl text-sepia/65">{statusMeta.description}</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <OrderStatusBadge status={order.status} />
            <p className="text-sm text-sepia/60">
              Creado el {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-crema p-4">
            <p className="text-sm font-semibold text-sepia/55">Canal</p>
            <p className="mt-1 font-bold text-sepia">
              {order.channel === "delivery" ? "Entrega a domicilio" : "Pickup"}
            </p>
          </div>
          <div className="rounded-2xl bg-crema p-4">
            <p className="text-sm font-semibold text-sepia/55">Tiempo estimado</p>
            <p className="mt-1 font-bold text-sepia">{order.etaLabel ?? "No aplica"}</p>
          </div>
          <div className="rounded-2xl bg-crema p-4">
            <p className="text-sm font-semibold text-sepia/55">Total</p>
            <p className="mt-1 font-bold text-sepia">{formatCurrency(order.total)}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-beige-tostado/25 bg-crema/50 p-5">
          <OrderProgressTracker status={order.status} />
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Productos del pedido</h3>
          <div className="mt-5 space-y-3">
            {order.items.map((item) => (
              <div
                key={`${order.id}-${item.productId}`}
                className="flex flex-col gap-2 rounded-2xl border border-beige-tostado/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-bold text-sepia">{item.productName}</p>
                  <p className="text-sm text-sepia/60">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-terracota">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-sepia">Seguimiento</h3>
            <p className="mt-3 text-sepia/70">{order.trackingNote}</p>
            <div className="mt-5">
              <RepeatOrderButton order={order} fullWidth />
            </div>
          </article>

          <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-sepia">Contacto</h3>
            <div className="mt-4 space-y-3 text-sepia/75">
              <p>
                <span className="font-semibold text-sepia">Cliente:</span> {order.customer.name}
              </p>
              <p>
                <span className="font-semibold text-sepia">Telefono:</span> {order.customer.phone}
              </p>
              <p>
                <span className="font-semibold text-sepia">Direccion:</span>{" "}
                {order.customer.address ?? "Sin direccion registrada"}
              </p>
              {order.notes ? (
                <p>
                  <span className="font-semibold text-sepia">Notas:</span> {order.notes}
                </p>
              ) : null}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
