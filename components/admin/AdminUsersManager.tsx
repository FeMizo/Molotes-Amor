"use client";

import { useMemo, useState } from "react";

import { listAdminUsers } from "@/services/account/account.service";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export const AdminUsersManager = () => {
  const usersSeed = useAuthStore((state) => state.users);
  const { orders, loading, error } = useAdminOrders();
  const users = useMemo(() => listAdminUsers(usersSeed, orders), [orders, usersSeed]);
  const [query, setQuery] = useState("");
  const [contactFilter, setContactFilter] = useState<
    "todos" | "whatsapp" | "telefono" | "email"
  >("todos");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(normalizedQuery);
      const matchesContact =
        contactFilter === "todos" || user.preferredContact === contactFilter;

      return matchesQuery && matchesContact;
    });
  }, [contactFilter, query, users]);

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Usuarios
            </p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
              Base de cuentas y clientes
            </h2>
            <p className="mt-2 text-sepia/65">
              Vista mock tipada para evolucionar despues a autenticacion real, CRM o historial de clientes.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, correo o telefono"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <select
              value={contactFilter}
              onChange={(event) =>
                setContactFilter(
                  event.target.value as typeof contactFilter,
                )
              }
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telefono">Telefono</option>
              <option value="email">Correo</option>
            </select>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        {error ? (
          <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm xl:col-span-2">
            <p className="font-semibold text-rojo-quemado">{error}</p>
          </article>
        ) : null}
        {filteredUsers.map((user) => (
          <article
            key={user.id}
            className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-sepia">{user.name}</h3>
                <p className="mt-1 text-sepia/60">{user.email}</p>
                <p className="text-sm text-sepia/55">{user.phone}</p>
              </div>
              <span className="rounded-full bg-crema px-3 py-2 text-sm font-semibold text-sepia">
                {user.preferredContact}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-crema p-4">
                <p className="text-sm text-sepia/55">Pedidos</p>
                <p className="mt-1 text-xl font-bold text-sepia">{user.totalOrders}</p>
              </div>
              <div className="rounded-2xl bg-crema p-4">
                <p className="text-sm text-sepia/55">Ventas</p>
                <p className="mt-1 text-xl font-bold text-sepia">
                  {formatCurrency(user.totalSpent)}
                </p>
              </div>
              <div className="rounded-2xl bg-crema p-4">
                <p className="text-sm text-sepia/55">Activos</p>
                <p className="mt-1 text-xl font-bold text-sepia">{user.activeOrderCount}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {user.tags.map((tag) => (
                <span
                  key={`${user.id}-${tag}`}
                  className="rounded-full border border-beige-tostado/30 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sepia/70"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full border border-beige-tostado/30 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sepia/70">
                {user.hasAddress ? "con direccion" : "sin direccion"}
              </span>
            </div>

            <p className="mt-5 text-sm text-sepia/60">
              {loading
                ? "Cargando actividad..."
                : `Ultima actividad: ${user.lastOrderAt ? formatDate(user.lastOrderAt) : "sin pedidos"}`}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
