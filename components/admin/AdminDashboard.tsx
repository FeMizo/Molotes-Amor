"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  PackageCheck,
  ShoppingCart,
  TriangleAlert,
  Users,
} from "lucide-react";

import { listAdminUsers } from "@/services/account/account.service";
import { useAdminInventory } from "@/hooks/use-admin-inventory";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useAdminProducts } from "@/hooks/use-admin-products";
import { formatCurrency } from "@/lib/format";
import { getOrderPaymentRef } from "@/lib/payment";
import { useAuthStore } from "@/store/auth-store";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export const AdminDashboard = () => {
  const { products } = useAdminProducts();
  const { rows } = useAdminInventory();
  const { orders } = useAdminOrders();
  const usersSeed = useAuthStore((state) => state.users);
  const users = listAdminUsers(usersSeed, orders);

  const lowStock = rows.filter((row) => row.status === "poco-stock" || row.status === "agotado").length;
  const pendingOrders = orders.filter((order) => order.status === "pendiente").length;
  const inTransitOrders = orders.filter((order) => order.status === "en-camino").length;
  const salesThisWeek = orders
    .filter((order) => order.status !== "cancelado")
    .reduce((sum, order) => sum + order.total, 0);
  const averageTicket = orders.length > 0 ? Math.round(salesThisWeek / orders.length) : 0;
  const highlightedProducts = products.filter((product) => product.featured).length;
  const topAlerts = rows
    .filter((row) => row.status !== "disponible")
    .slice(0, 4);
  const latestOrders = orders.slice(0, 4);
  const deliveryOrders = orders.filter((order) => Boolean(order.customer.address)).length;
  const pickupOrders = Math.max(0, orders.length - deliveryOrders);
  const topProducts = Object.values(
    orders.reduce<
      Record<string, { productId: string; name: string; quantity: number; total: number }>
    >((acc, order) => {
      for (const item of order.items) {
        const current = acc[item.productId] ?? {
          productId: item.productId,
          name: item.productName,
          quantity: 0,
          total: 0,
        };

        acc[item.productId] = {
          ...current,
          quantity: current.quantity + item.quantity,
          total: current.total + item.lineTotal,
        };
      }

      return acc;
    }, {}),
  )
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
          Vista operativa
        </p>
        <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
          Dashboard principal
        </h2>
        <p className="mt-2 text-sepia/65">
          Resumen rapido para entrar a pedidos, alertas y acciones de mantenimiento sin cargar contenido editorial en la misma vista.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <Boxes size={20} className="text-terracota" />
            <p className="font-semibold">Productos</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{products.length}</p>
          <p className="mt-2 text-sm text-sepia/60">{highlightedProducts} destacados activos</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <ShoppingCart size={20} className="text-terracota" />
            <p className="font-semibold">Pedidos pendientes</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{pendingOrders}</p>
          <p className="mt-2 text-sm text-sepia/60">{inTransitOrders} actualmente en camino</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <PackageCheck size={20} className="text-terracota" />
            <p className="font-semibold">Alertas de inventario</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{lowStock}</p>
          <p className="mt-2 text-sm text-sepia/60">Incluye poco stock y agotados</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <Users size={20} className="text-terracota" />
            <p className="font-semibold">Ventas registradas</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">
            {formatCurrency(salesThisWeek)}
          </p>
          <p className="mt-2 text-sm text-sepia/60">{users.length} perfiles mock listos para evolucionar</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sepia">Top productos</h3>
              <p className="mt-2 text-sepia/65">
                Lectura rapida para detectar los productos que mejor empujan ventas.
              </p>
            </div>
            <Boxes size={20} className="text-terracota" />
          </div>

          <div className="mt-5 space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between rounded-2xl border border-beige-tostado/20 p-4"
                >
                  <div>
                    <p className="font-semibold text-sepia">
                      {index + 1}. {product.name}
                    </p>
                    <p className="text-sm text-sepia/60">{product.quantity} piezas vendidas</p>
                  </div>
                  <span className="font-bold text-terracota">{formatCurrency(product.total)}</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-crema px-4 py-5 text-sepia/65">
                Aun no hay ventas suficientes para construir el ranking.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sepia">Mix operativo</h3>
              <p className="mt-2 text-sepia/65">
                Indicadores utiles para ajustar conversion, entrega y ticket promedio.
              </p>
            </div>
            <ShoppingCart size={20} className="text-terracota" />
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-crema p-4">
              <p className="text-sm text-sepia/55">Ticket promedio</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">
                {formatCurrency(averageTicket)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-crema p-4">
                <p className="text-sm text-sepia/55">Delivery</p>
                <p className="mt-1 text-xl font-bold text-sepia">{deliveryOrders}</p>
              </div>
              <div className="rounded-2xl bg-crema p-4">
                <p className="text-sm text-sepia/55">Pickup</p>
                <p className="mt-1 text-xl font-bold text-sepia">{pickupOrders}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/products" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Productos</h3>
          <p className="text-sepia/70 mt-2">Alta, edicion, destacados y filtros internos para operar catalogo.</p>
        </Link>
        <Link href="/admin/inventory" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Inventario</h3>
          <p className="text-sepia/70 mt-2">Stock, minimo, backorder y estado disponible/poco/agotado.</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Pedidos</h3>
          <p className="text-sepia/70 mt-2">Listado, detalle, filtros por estado y seguimiento operativo.</p>
        </Link>
        <Link href="/admin/content" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Contenido</h3>
          <p className="text-sepia/70 mt-2">Editor separado para Home, Menu, Nosotros y Contacto.</p>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sepia">
                Alertas prioritarias
              </h3>
              <p className="mt-2 text-sepia/65">
                Productos que ya requieren atencion por inventario.
              </p>
            </div>
            <TriangleAlert size={20} className="text-terracota" />
          </div>

          <div className="mt-5 space-y-3">
            {topAlerts.length > 0 ? (
              topAlerts.map((row) => (
                <Link
                  key={row.productId}
                  href="/admin/inventory"
                  className="flex items-center justify-between rounded-2xl border border-beige-tostado/20 p-4 transition-colors hover:border-terracota/40 hover:bg-crema"
                >
                  <div>
                    <p className="font-semibold text-sepia">{row.productName}</p>
                    <p className="text-sm text-sepia/60">
                      Stock {row.stock} · Minimo {row.minStock ?? "sin definir"}
                    </p>
                  </div>
                  <span className="text-sm font-bold uppercase text-terracota">
                    {row.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl bg-crema px-4 py-5 text-sepia/65">
                No hay alertas de inventario en este momento.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sepia">
                Ultimos pedidos
              </h3>
              <p className="mt-2 text-sepia/65">
                Entrada rapida al flujo operativo mas reciente.
              </p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-bold text-terracota">
              Ver pedidos
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {latestOrders.length > 0 ? (
              latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-beige-tostado/20 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sepia">Ref. {getOrderPaymentRef(order)}</p>
                      <p className="text-sm text-sepia/60">{order.customer.name}</p>
                    </div>
                    <OrderStatusBadge status={order.status} compact />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-sepia/60">{order.items.length} items</span>
                    <span className="font-bold text-terracota">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-crema px-4 py-5 text-sepia/65">
                Aun no hay pedidos para mostrar.
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
