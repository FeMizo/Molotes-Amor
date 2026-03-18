"use client";

import { useMemo, useState } from "react";

import { useAdminUsers } from "@/hooks/use-admin-users";
import { assertValidEmail, assertValidPhone } from "@/lib/contact";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AppUserRole } from "@/types/auth";
import type { PreferredContact } from "@/types/account";

import { ModalShell } from "../shared/ModalShell";

interface UserFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  role: AppUserRole;
  isActive: boolean;
}

const emptyForm: UserFormState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  preferredContact: "whatsapp",
  role: "user",
  isActive: true,
};

export const AdminUsersManager = () => {
  const { users, loading, error, saveUser } = useAdminUsers();
  const [query, setQuery] = useState("");
  const [contactFilter, setContactFilter] = useState<"todos" | PreferredContact>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "inactivos">("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${user.name} ${user.username} ${user.email} ${user.phone}`.toLowerCase().includes(normalizedQuery);
      const matchesContact = contactFilter === "todos" || user.preferredContact === contactFilter;
      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "activos" && user.isActive) ||
        (statusFilter === "inactivos" && !user.isActive);

      return matchesQuery && matchesContact && matchesStatus;
    });
  }, [contactFilter, query, statusFilter, users]);

  const summary = useMemo(
    () => ({
      total: filteredUsers.length,
      active: filteredUsers.filter((user) => user.isActive).length,
      admins: filteredUsers.filter((user) => user.role === "admin").length,
      withOrders: filteredUsers.filter((user) => user.totalOrders > 0).length,
    }),
    [filteredUsers],
  );

  const openEditor = (userId: string) => {
    const user = users.find((candidate) => candidate.id === userId);
    if (!user) {
      return;
    }

    setEditingId(userId);
    setSubmitError(null);
    setFeedback(null);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      preferredContact: user.preferredContact,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const closeEditor = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    setSubmitError(null);

    try {
      const email = assertValidEmail(form.email);
      const phone = assertValidPhone(form.phone, "Ingresa un telefono valido.");

      saveUser(editingId, {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email,
        phone,
        preferredContact: form.preferredContact,
        role: form.role,
        isActive: form.isActive,
      });
      setFeedback("Usuario actualizado correctamente.");
      closeEditor();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo actualizar el usuario.");
    }
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Usuarios
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
              Base de cuentas y clientes
            </h2>
            <p className="mt-2 text-sepia/65">
              Edita usuarios mock persistidos, roles y estado de acceso sin salir del dashboard.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, username, correo o telefono"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <select
              value={contactFilter}
              onChange={(event) => setContactFilter(event.target.value as typeof contactFilter)}
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telefono">Telefono</option>
              <option value="email">Correo</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-crema px-4 py-3">
            <p className="text-sm text-sepia/55">Usuarios visibles</p>
            <p className="mt-1 text-2xl font-serif font-bold text-sepia">{summary.total}</p>
          </div>
          <div className="rounded-2xl bg-crema px-4 py-3">
            <p className="text-sm text-sepia/55">Activos</p>
            <p className="mt-1 text-2xl font-serif font-bold text-sepia">{summary.active}</p>
          </div>
          <div className="rounded-2xl bg-crema px-4 py-3">
            <p className="text-sm text-sepia/55">Admins</p>
            <p className="mt-1 text-2xl font-serif font-bold text-sepia">{summary.admins}</p>
          </div>
          <div className="rounded-2xl bg-crema px-4 py-3">
            <p className="text-sm text-sepia/55">Con pedidos</p>
            <p className="mt-1 text-2xl font-serif font-bold text-sepia">{summary.withOrders}</p>
          </div>
        </div>
      </article>

      {feedback ? <p className="font-semibold text-olivo">{feedback}</p> : null}
      {submitError ? <p className="font-semibold text-rojo-quemado">{submitError}</p> : null}

      <div className="grid gap-4">
        {error ? (
          <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
            <p className="font-semibold text-rojo-quemado">{error}</p>
          </article>
        ) : null}

        {filteredUsers.map((user) => (
          <article
            key={user.id}
            className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-[1.5rem] border border-beige-tostado/20 bg-white p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                      Usuario
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-serif font-bold text-sepia">{user.name}</h3>
                      <span className="rounded-full bg-crema px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sepia/70">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-crema px-3 py-2 text-sm font-semibold text-sepia">
                      {user.preferredContact}
                    </span>
                    <span
                      className={`rounded-full px-3 py-2 text-sm font-semibold ${
                        user.isActive
                          ? "bg-olivo/10 text-olivo"
                          : "bg-rojo-quemado/10 text-rojo-quemado"
                      }`}
                    >
                      {user.isActive ? "activo" : "inactivo"}
                    </span>
                    <span className="rounded-full bg-beige-tostado/20 px-3 py-2 text-sm font-semibold text-sepia">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-crema p-4">
                    <p className="text-sm text-sepia/55">Correo</p>
                    <p className="mt-1 font-semibold text-sepia break-all">{user.email}</p>
                  </div>
                  <div className="rounded-2xl bg-crema p-4">
                    <p className="text-sm text-sepia/55">Telefono</p>
                    <p className="mt-1 font-semibold text-sepia">{user.phone}</p>
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

                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-sepia/60">
                    {loading
                      ? "Cargando actividad..."
                      : `Ultima actividad: ${user.lastOrderAt ? formatDate(user.lastOrderAt) : "sin pedidos"}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => openEditor(user.id)}
                    className="rounded-xl border border-beige-tostado/35 px-4 py-2 font-semibold text-sepia transition-colors hover:border-terracota"
                  >
                    Editar usuario
                  </button>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-beige-tostado/20 bg-crema/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                      Pedidos
                    </p>
                    <h4 className="mt-2 text-xl font-serif font-bold text-sepia">
                      Resumen comercial
                    </h4>
                  </div>
                  <span className="rounded-full border border-beige-tostado/25 bg-white px-3 py-2 text-sm font-semibold text-sepia">
                    {user.totalOrders > 0 ? "con historial" : "sin historial"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-sepia/55">Pedidos</p>
                    <p className="mt-1 text-xl font-bold text-sepia">{user.totalOrders}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-sepia/55">Ventas</p>
                    <p className="mt-1 text-xl font-bold text-sepia">{formatCurrency(user.totalSpent)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-sepia/55">Pedidos activos</p>
                    <p className="mt-1 text-xl font-bold text-sepia">{user.activeOrderCount}</p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        ))}
      </div>

      <ModalShell
        open={Boolean(editingId)}
        onClose={closeEditor}
        title="Editar usuario"
        description="Actualiza nombre, username, rol y estado sin romper el store actual."
      >
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              placeholder="Nombre"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <input
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              placeholder="Apellido"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              placeholder="Username"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Correo"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              required
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Telefono"
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <select
              value={form.preferredContact}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, preferredContact: event.target.value as PreferredContact }))
              }
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="telefono">Telefono</option>
              <option value="email">Correo</option>
            </select>
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as AppUserRole }))}
              className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 rounded-xl bg-crema px-4 py-3 font-semibold text-sepia">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Cuenta activa
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
};
