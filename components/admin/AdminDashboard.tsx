"use client";

import Link from "next/link";
import { Boxes, FilePenLine, PackageCheck, ShoppingCart } from "lucide-react";

import { AdminContentManager } from "@/components/admin/AdminContentManager";
import { useAdminInventory } from "@/hooks/use-admin-inventory";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useAdminProducts } from "@/hooks/use-admin-products";

export const AdminDashboard = () => {
  const { products } = useAdminProducts();
  const { rows } = useAdminInventory();
  const { orders } = useAdminOrders();

  const lowStock = rows.filter((row) => row.status === "poco-stock" || row.status === "agotado").length;
  const pendingOrders = orders.filter((order) => order.status === "pendiente").length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <Boxes size={20} className="text-terracota" />
            <p className="font-semibold">Productos</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{products.length}</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <ShoppingCart size={20} className="text-terracota" />
            <p className="font-semibold">Pedidos pendientes</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{pendingOrders}</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <PackageCheck size={20} className="text-terracota" />
            <p className="font-semibold">Alertas de inventario</p>
          </div>
          <p className="text-4xl font-serif font-bold text-sepia mt-3">{lowStock}</p>
        </article>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/admin/products" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Productos</h3>
          <p className="text-sepia/70 mt-2">Alta, edicion, destacados, disponibilidad y eliminacion.</p>
        </Link>
        <Link href="/admin/inventory" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Inventario</h3>
          <p className="text-sepia/70 mt-2">Stock, minimo, backorder y estado disponible/poco/agotado.</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-sepia">Pedidos</h3>
          <p className="text-sepia/70 mt-2">Listado, detalle y cambio de estado en flujo operativo.</p>
        </Link>
        <a href="#site-content" className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <div className="flex items-center gap-3 text-sepia">
            <FilePenLine size={20} className="text-terracota" />
            <h3 className="text-2xl font-serif font-bold text-sepia">Contenido</h3>
          </div>
          <p className="text-sepia/70 mt-2">Controla Home, Menu, Nosotros y Contacto desde aqui.</p>
        </a>
      </div>

      <AdminContentManager />
    </div>
  );
};
