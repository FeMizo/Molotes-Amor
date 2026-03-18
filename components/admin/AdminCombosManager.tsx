"use client";

import { useMemo, useState } from "react";

import { useAdminCombos } from "@/hooks/use-admin-combos";
import { useAdminProducts } from "@/hooks/use-admin-products";
import { formatCurrency } from "@/lib/format";
import type { ComboAdminFormState } from "@/types/admin";

import { AdminComboForm } from "./AdminComboForm";
import { ModalShell } from "../shared/ModalShell";

const emptyForm: ComboAdminFormState = {
  name: "",
  description: "",
  image: "",
  finalPrice: "",
  active: true,
  featured: false,
  order: "0",
  category: "Combos",
  items: [],
};

export const AdminCombosManager = () => {
  const { products, loading: productsLoading } = useAdminProducts();
  const { combos, loading, error, createCombo, updateCombo, deleteCombo } = useAdminCombos();
  const [form, setForm] = useState<ComboAdminFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "inactivos" | "destacados">("todos");
  const [productQuery, setProductQuery] = useState("");
  const [productCategory, setProductCategory] = useState("Todos");

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const productCategories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );
  const filteredProducts = useMemo(() => {
    const normalizedQuery = productQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        productCategory === "Todos" || product.category === productCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.category} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [productCategory, productQuery, products]);
  const regularPrice = useMemo(
    () =>
      form.items.reduce((sum, item) => {
        const product = productMap.get(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [form.items, productMap],
  );
  const savings = Math.max(0, regularPrice - Number(form.finalPrice || 0));
  const filteredCombos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return combos.filter((combo) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${combo.name} ${combo.category ?? ""} ${combo.items
          .map((item) => productMap.get(item.productId)?.name ?? item.productId)
          .join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "activos" && combo.active) ||
        (statusFilter === "inactivos" && !combo.active) ||
        (statusFilter === "destacados" && combo.featured);

      return matchesQuery && matchesStatus;
    });
  }, [combos, productMap, query, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setProductQuery("");
    setProductCategory("Todos");
    setStatusMessage(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    if (submitting) {
      return;
    }

    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setProductQuery("");
    setProductCategory("Todos");
  };

  const fillFormForEdit = (id: string) => {
    const combo = combos.find((item) => item.id === id);
    if (!combo) {
      return;
    }

    setEditingId(combo.id);
    setForm({
      name: combo.name,
      description: combo.description ?? "",
      image: combo.image ?? "",
      finalPrice: String(combo.finalPrice),
      active: combo.active,
      featured: combo.featured,
      order: String(combo.order),
      category: combo.category ?? "Combos",
      items: combo.items,
    });
    setProductQuery("");
    setProductCategory("Todos");
    setStatusMessage(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setStatusMessage(null);
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        image: form.image || undefined,
        items: form.items,
        finalPrice: Number(form.finalPrice),
        active: form.active,
        featured: form.featured,
        order: Number(form.order || 0),
        category: form.category,
      };

      if (editingId) {
        await updateCombo(editingId, payload);
        setStatusMessage("Combo actualizado correctamente.");
      } else {
        await createCombo(payload);
        setStatusMessage("Combo creado correctamente.");
      }

      closeFormModal();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo guardar el combo.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFlags = async (
    id: string,
    key: "active" | "featured",
    currentValue: boolean,
  ) => {
    setSubmitError(null);
    setStatusMessage(null);
    setPendingAction(`${key}:${id}`);

    try {
      await updateCombo(id, { [key]: !currentValue });
      setStatusMessage("Combo actualizado correctamente.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo actualizar el combo.");
    } finally {
      setPendingAction(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este combo?")) {
      return;
    }

    setSubmitError(null);
    setStatusMessage(null);
    setPendingAction(`delete:${id}`);

    try {
      await deleteCombo(id);
      setStatusMessage("Combo eliminado.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo eliminar el combo.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Combos
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
              Paquetes armados con productos existentes
            </h2>
            <p className="mt-2 text-sepia/65">
              Crea combinaciones como molote + refresco sin duplicar productos, manteniendo una sola fuente de catalogo.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-crema px-4 py-3">
                <p className="text-sm text-sepia/55">Total</p>
                <p className="mt-1 text-2xl font-serif font-bold text-sepia">{combos.length}</p>
              </div>
              <div className="rounded-2xl bg-crema px-4 py-3">
                <p className="text-sm text-sepia/55">Activos</p>
                <p className="mt-1 text-2xl font-serif font-bold text-sepia">
                  {combos.filter((combo) => combo.active).length}
                </p>
              </div>
              <div className="rounded-2xl bg-crema px-4 py-3">
                <p className="text-sm text-sepia/55">Con bebida</p>
                <p className="mt-1 text-2xl font-serif font-bold text-sepia">
                  {combos.filter((combo) =>
                    combo.items.some((item) => productMap.get(item.productId)?.category === "Bebidas"),
                  ).length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
            >
              Nuevo combo
            </button>
          </div>
        </div>
      </article>

      {statusMessage ? <p className="font-semibold text-olivo">{statusMessage}</p> : null}
      {submitError ? <p className="font-semibold text-rojo-quemado">{submitError}</p> : null}
      {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sepia">Listado de combos</h3>
              <p className="mt-1 text-sepia/65">
                Filtra por estado y revisa rapido que productos, refrescos y precios componen cada paquete.
              </p>
            </div>
            <span className="text-sm font-semibold text-sepia/70">
              {loading ? "Cargando..." : `${filteredCombos.length} visibles`}
            </span>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por combo, categoria o producto incluido"
            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
          />

          <div className="flex flex-wrap gap-2">
            {[
              ["todos", "Todos"],
              ["activos", "Activos"],
              ["inactivos", "Inactivos"],
              ["destacados", "Destacados"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value as typeof statusFilter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  statusFilter === value
                    ? "border-terracota bg-terracota text-crema"
                    : "border-beige-tostado/30 bg-crema text-sepia"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filteredCombos.map((combo) => {
            const isActivePending = pendingAction === `active:${combo.id}`;
            const isFeaturedPending = pendingAction === `featured:${combo.id}`;
            const isDeletePending = pendingAction === `delete:${combo.id}`;
            const productSummary = combo.items
              .map((item) => {
                const product = productMap.get(item.productId);
                return `${item.quantity}x ${product?.name ?? item.productId}`;
              })
              .join(" · ");

            return (
              <div
                key={combo.id}
                className="rounded-2xl border border-beige-tostado/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sepia">{combo.name}</h4>
                      {combo.featured ? (
                        <span className="rounded-full bg-mostaza/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-canela">
                          destacado
                        </span>
                      ) : null}
                      {!combo.active ? (
                        <span className="rounded-full bg-rojo-quemado/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-rojo-quemado">
                          inactivo
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-sepia/70">
                      {combo.category ?? "Sin categoria"} · Final {formatCurrency(combo.finalPrice)} · Normal {formatCurrency(combo.regularPrice)}
                    </p>
                    <p className="mt-1 text-sm text-sepia/55">{productSummary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fillFormForEdit(combo.id)}
                      disabled={submitting || pendingAction !== null}
                      className="rounded-xl border border-beige-tostado/35 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:border-terracota disabled:opacity-60"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleFlags(combo.id, "active", combo.active)}
                      disabled={submitting || pendingAction !== null}
                      className="rounded-xl border border-beige-tostado/35 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:border-terracota disabled:opacity-60"
                    >
                      {isActivePending ? "Guardando..." : combo.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleFlags(combo.id, "featured", combo.featured)}
                      disabled={submitting || pendingAction !== null}
                      className="rounded-xl bg-beige-tostado/30 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:bg-beige-tostado/50 disabled:opacity-60"
                    >
                      {isFeaturedPending ? "Guardando..." : combo.featured ? "Quitar destacado" : "Destacar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(combo.id)}
                      disabled={submitting || pendingAction !== null}
                      className="rounded-xl bg-rojo-quemado/10 px-3 py-2 text-sm font-semibold text-rojo-quemado transition-colors hover:bg-rojo-quemado/20 disabled:opacity-60"
                    >
                      {isDeletePending ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && filteredCombos.length === 0 ? (
            <p className="rounded-2xl bg-crema px-4 py-10 text-center text-sepia/60">
              No hay combos para ese filtro.
            </p>
          ) : null}
        </div>
      </article>

      <ModalShell
        open={isFormOpen}
        onClose={closeFormModal}
        title={editingId ? "Editar combo" : "Nuevo combo"}
        description="Arma paquetes reutilizando productos existentes y define precio final sin duplicar el catalogo."
      >
        <AdminComboForm
          form={form}
          setForm={setForm}
          onSubmit={submit}
          editing={Boolean(editingId)}
          submitting={submitting}
          submitError={submitError}
          apiError={error}
          onCancel={closeFormModal}
          regularPrice={regularPrice}
          savings={savings}
          productQuery={productQuery}
          setProductQuery={setProductQuery}
          productCategory={productCategory}
          setProductCategory={setProductCategory}
          productCategories={productCategories}
          allProducts={products}
          filteredProducts={filteredProducts}
        />
      </ModalShell>

      {productsLoading && products.length === 0 ? (
        <p className="text-sm text-sepia/60">Cargando productos para armar combos...</p>
      ) : null}
    </div>
  );
};
