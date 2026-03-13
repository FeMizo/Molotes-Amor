"use client";

import Link from "next/link";
import { Clock3, Heart, Package, PhoneCall, ReceiptText } from "lucide-react";

import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useUserAccount } from "@/hooks/use-user-account";

import { AccountEmptyState } from "./AccountEmptyState";
import { RepeatOrderButton } from "./RepeatOrderButton";
import { OrderProgressTracker } from "../orders/OrderProgressTracker";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { ProductCard } from "../products/ProductCard";

export const AccountDashboard = () => {
  const { activeOrder, error, favoriteProducts, loading, profile, recentOrders, stats } =
    useUserAccount();

  if (loading) {
    return (
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 shadow-sm">
        <p className="font-semibold text-sepia">Cargando tu centro de pedidos...</p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 shadow-sm">
        <p className="font-semibold text-rojo-quemado">{error}</p>
      </article>
    );
  }

  if (!profile) {
    return null;
  }

  if (recentOrders.length === 0) {
    return (
      <AccountEmptyState
        title="Tu centro de pedidos esta listo"
        description="En cuanto hagas tu primer pedido, aqui podras seguir estados, repetir ordenes y guardar favoritos para comprar mas rapido."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-beige-tostado/30 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-beige-tostado/20">
              <ReceiptText size={18} />
            </span>
            <div>
              <p className="text-sm text-sepia/60">Pedidos totales</p>
              <p className="text-3xl font-serif font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-beige-tostado/30 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-beige-tostado/20">
              <Clock3 size={18} />
            </span>
            <div>
              <p className="text-sm text-sepia/60">Pedidos activos</p>
              <p className="text-3xl font-serif font-bold">{stats.activeOrders}</p>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-beige-tostado/30 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-beige-tostado/20">
              <Package size={18} />
            </span>
            <div>
              <p className="text-sm text-sepia/60">Ultimo pedido</p>
              <p className="text-lg font-bold">
                {stats.lastOrderAt ? formatDate(stats.lastOrderAt) : "Sin fecha"}
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-beige-tostado/30 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-beige-tostado/20">
              <Heart size={18} />
            </span>
            <div>
              <p className="text-sm text-sepia/60">Favoritos</p>
              <p className="text-3xl font-serif font-bold">{stats.favoriteCount}</p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                Pedido actual
              </p>
              <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
                {activeOrder ? activeOrder.id : "Sin pedido activo"}
              </h2>
              <p className="mt-2 max-w-2xl text-sepia/65">
                {activeOrder
                  ? activeOrder.trackingNote
                  : "No tienes pedidos en proceso. Cuando haya uno activo, aqui veras su avance y el tiempo estimado."}
              </p>
            </div>
            {activeOrder ? <OrderStatusBadge status={activeOrder.status} /> : null}
          </div>

          {activeOrder ? (
            <div className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-crema p-4">
                  <p className="text-sm font-semibold text-sepia/60">Hora estimada</p>
                  <p className="mt-1 text-lg font-bold text-sepia">
                    {activeOrder.etaLabel ?? "En actualizacion"}
                  </p>
                </div>
                <div className="rounded-2xl bg-crema p-4">
                  <p className="text-sm font-semibold text-sepia/60">Canal</p>
                  <p className="mt-1 text-lg font-bold capitalize text-sepia">
                    {activeOrder.channel === "delivery" ? "Entrega" : "Recoger en tienda"}
                  </p>
                </div>
                <div className="rounded-2xl bg-crema p-4">
                  <p className="text-sm font-semibold text-sepia/60">Contacto</p>
                  <p className="mt-1 text-lg font-bold text-sepia">{profile.phone}</p>
                </div>
              </div>

              <OrderProgressTracker status={activeOrder.status} />

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-sepia/65">
                  Ultima actualizacion: {formatDateTime(activeOrder.createdAt)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/mi-cuenta/pedidos/${activeOrder.id}`}
                    className="inline-flex rounded-xl border border-beige-tostado/35 px-4 py-3 font-bold text-sepia transition-colors hover:border-terracota"
                  >
                    Ver detalle
                  </Link>
                  <RepeatOrderButton order={activeOrder} />
                </div>
              </div>
            </div>
          ) : null}
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                Cuenta
              </p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
                {profile.firstName} {profile.lastName}
              </h2>
            </div>
            <PhoneCall size={20} className="text-sepia/50" />
          </div>

          <div className="mt-5 space-y-4 rounded-2xl bg-crema p-5">
            <div>
              <p className="text-sm font-semibold text-sepia/55">Correo</p>
              <p className="font-semibold text-sepia">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-sepia/55">Telefono</p>
              <p className="font-semibold text-sepia">{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-sepia/55">Direccion principal</p>
              <p className="font-semibold text-sepia">
                {profile.addresses.find((address) => address.isDefault)?.line1 ??
                  "Sin direccion principal"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/mi-cuenta/perfil"
              className="inline-flex rounded-xl bg-terracota px-4 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
            >
              Editar cuenta
            </Link>
            <Link
              href="/mi-cuenta/seguridad"
              className="inline-flex rounded-xl border border-beige-tostado/35 px-4 py-3 font-bold text-sepia transition-colors hover:border-terracota"
            >
              Seguridad
            </Link>
          </div>
        </article>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-sepia">
                Pedidos recientes
              </h2>
              <p className="mt-1 text-sepia/65">
                Resumen rapido para seguir lo ultimo que pediste.
              </p>
            </div>
            <Link href="/mi-cuenta/pedidos" className="text-sm font-bold text-terracota">
              Ver historial
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/mi-cuenta/pedidos/${order.id}`}
                className="block rounded-2xl border border-beige-tostado/25 p-4 transition-colors hover:border-terracota/40 hover:bg-crema"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-sepia">{order.id}</p>
                    <p className="mt-1 text-sm text-sepia/60">
                      {formatDate(order.createdAt)} · {order.items.length} productos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} compact />
                    <span className="font-bold text-terracota">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-sepia/70">
                  {order.items.map((item) => item.productName).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-sepia">
                Guardados para despues
              </h2>
              <p className="mt-1 text-sepia/65">
                Tus antojos favoritos listos para volver al carrito.
              </p>
            </div>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {favoriteProducts.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-crema px-5 py-8">
              <p className="font-semibold text-sepia">Aun no guardas favoritos.</p>
              <p className="mt-2 text-sm text-sepia/65">
                Marca molotes en el menu para tenerlos a un toque dentro de tu panel.
              </p>
              <Link
                href="/menu"
                className="mt-4 inline-flex rounded-xl border border-beige-tostado/35 px-4 py-3 font-bold text-sepia transition-colors hover:border-terracota"
              >
                Ir al menu
              </Link>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
