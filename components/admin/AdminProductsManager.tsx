"use client";

import { useMemo, useState } from "react";

import { useAdminProducts } from "@/hooks/use-admin-products";
import type { ProductAdminFormState } from "@/types/admin";

const emptyForm: ProductAdminFormState = {
  name: "",
  description: "",
  longDescription: "",
  price: "",
  previousPrice: "",
  category: "Tradicionales",
  image: "",
  featured: false,
  available: true,
  tags: "",
  badge: "",
  stock: "0",
  minStock: "",
  allowBackorder: false,
};

const parseList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const AdminProductsManager = () => {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } =
    useAdminProducts();
  const [form, setForm] = useState<ProductAdminFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "todos" | "activos" | "inactivos" | "destacados"
  >("todos");

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );
  const lowStockCount = products.filter(
    (product) => product.inventory.stock <= (product.inventory.minStock ?? 0),
  ).length;
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.category} ${product.tags.join(" ")}`.toLowerCase().includes(normalizedQuery);
      const matchesAvailability =
        availabilityFilter === "todos" ||
        (availabilityFilter === "activos" && product.available) ||
        (availabilityFilter === "inactivos" && !product.available) ||
        (availabilityFilter === "destacados" && product.featured);

      return matchesQuery && matchesAvailability;
    });
  }, [availabilityFilter, products, query]);

  const fillFormForEdit = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) {
      return;
    }

    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: String(product.price),
      previousPrice: product.previousPrice ? String(product.previousPrice) : "",
      category: product.category,
      image: product.image,
      featured: product.featured,
      available: product.available,
      tags: product.tags.join(", "),
      badge: product.badge ?? "",
      stock: String(product.inventory.stock),
      minStock:
        product.inventory.minStock !== undefined
          ? String(product.inventory.minStock)
          : "",
      allowBackorder: product.inventory.allowBackorder,
    });
    setStatusMessage(null);
    setSubmitError(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setStatusMessage(null);
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        longDescription: form.longDescription,
        price: Number(form.price),
        previousPrice: form.previousPrice ? Number(form.previousPrice) : undefined,
        category: form.category,
        image: form.image,
        featured: form.featured,
        available: form.available,
        tags: parseList(form.tags),
        badge: form.badge || undefined,
        stock: Number(form.stock),
        minStock: form.minStock ? Number(form.minStock) : undefined,
        allowBackorder: form.allowBackorder,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setStatusMessage("Producto actualizado correctamente.");
      } else {
        await createProduct(payload);
        setStatusMessage("Producto creado correctamente.");
      }

      resetForm();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFlags = async (
    id: string,
    key: "available" | "featured",
    currentValue: boolean,
  ) => {
    setSubmitError(null);
    setStatusMessage(null);
    setPendingAction(`${key}:${id}`);

    try {
      await updateProduct(id, { [key]: !currentValue });
      setStatusMessage("Producto actualizado correctamente.");
    } catch {
      setSubmitError("No se pudo actualizar el estado del producto.");
    } finally {
      setPendingAction(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este producto?")) {
      return;
    }

    setSubmitError(null);
    setStatusMessage(null);
    setPendingAction(`delete:${id}`);

    try {
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      setStatusMessage("Producto eliminado.");
    } catch {
      setSubmitError("No se pudo eliminar el producto.");
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
              Productos
            </p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
              Catalogo y administracion
            </h2>
            <p className="mt-2 text-sepia/65">
              Gestiona productos con una vista mas ordenada, buscador interno y segmentacion por disponibilidad.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Total</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{products.length}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Destacados</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">
                {products.filter((product) => product.featured).length}
              </p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Bajo stock</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_1.1fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-2xl font-serif font-bold text-sepia">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </h3>
            <p className="mt-2 text-sepia/65">
              Mantiene el mismo flujo actual, pero con mejor jerarquia y formularios mas legibles.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <input
              required
              placeholder="Nombre"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <input
              required
              placeholder="Descripcion corta"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <textarea
              required
              placeholder="Descripcion larga"
              value={form.longDescription}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, longDescription: event.target.value }))
              }
              className="min-h-24 w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                required
                placeholder="Precio"
                type="number"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
              <input
                placeholder="Precio anterior"
                type="number"
                value={form.previousPrice}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, previousPrice: event.target.value }))
                }
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="Categoria"
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value }))
                }
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
              <input
                placeholder="Badge"
                value={form.badge}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    badge: event.target.value as ProductAdminFormState["badge"],
                  }))
                }
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </div>
            <input
              placeholder="URL imagen"
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
            <input
              placeholder="Tags separados por coma"
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />

            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
              <input
                type="number"
                placeholder="Stock minimo"
                value={form.minStock}
                onChange={(event) => setForm((prev) => ({ ...prev, minStock: event.target.value }))}
                className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
              <label className="flex items-center gap-2 rounded-xl bg-crema px-4 py-3 text-sm font-semibold text-sepia">
                <input
                  type="checkbox"
                  checked={form.allowBackorder}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, allowBackorder: event.target.checked }))
                  }
                />
                Backorder
              </label>
            </div>

            <div className="flex flex-wrap gap-4 rounded-xl bg-crema px-4 py-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, available: event.target.checked }))
                  }
                />
                Disponible
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, featured: event.target.checked }))
                  }
                />
                Destacado
              </label>
            </div>

            {statusMessage ? <p className="font-semibold text-olivo">{statusMessage}</p> : null}
            {submitError ? <p className="font-semibold text-rojo-quemado">{submitError}</p> : null}
            {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                disabled={submitting}
                className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-sepia">Listado de productos</h3>
                <p className="mt-1 text-sepia/65">
                  Busca rapido por nombre, categoria o tags y filtra por estado.
                </p>
              </div>
              <span className="text-sm font-semibold text-sepia/70">
                {loading ? "Cargando..." : `${filteredProducts.length} visibles`}
              </span>
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, categoria o tags"
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
                  onClick={() =>
                    setAvailabilityFilter(value as typeof availabilityFilter)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    availabilityFilter === value
                      ? "border-terracota bg-terracota text-crema"
                      : "border-beige-tostado/30 bg-crema text-sepia"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {categories.length > 0 ? (
              <p className="text-sm text-sepia/60">Categorias: {categories.join(", ")}</p>
            ) : null}
          </div>

          <div className="mt-5 space-y-3 max-h-[760px] overflow-auto pr-1">
            {filteredProducts.map((product) => {
              const isAvailabilityPending = pendingAction === `available:${product.id}`;
              const isFeaturedPending = pendingAction === `featured:${product.id}`;
              const isDeletePending = pendingAction === `delete:${product.id}`;
              const hasPendingAction = pendingAction !== null;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-beige-tostado/20 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sepia">{product.name}</h4>
                        {product.featured ? (
                          <span className="rounded-full bg-mostaza/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-canela">
                            destacado
                          </span>
                        ) : null}
                        {!product.available ? (
                          <span className="rounded-full bg-rojo-quemado/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-rojo-quemado">
                            inactivo
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-sepia/70">
                        ${product.price} · {product.category} · Stock {product.inventory.stock}
                      </p>
                      <p className="mt-1 text-sm text-sepia/55">{product.tags.join(", ")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fillFormForEdit(product.id)}
                        disabled={submitting || hasPendingAction}
                        className="rounded-xl border border-beige-tostado/35 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:border-terracota disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleFlags(product.id, "available", product.available)}
                        disabled={submitting || hasPendingAction}
                        className="rounded-xl border border-beige-tostado/35 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:border-terracota disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAvailabilityPending ? "Guardando..." : product.available ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleFlags(product.id, "featured", product.featured)}
                        disabled={submitting || hasPendingAction}
                        className="rounded-xl bg-beige-tostado/30 px-3 py-2 text-sm font-semibold text-sepia transition-colors hover:bg-beige-tostado/50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isFeaturedPending ? "Guardando..." : product.featured ? "Quitar destacado" : "Destacar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(product.id)}
                        disabled={submitting || hasPendingAction}
                        className="rounded-xl bg-rojo-quemado/10 px-3 py-2 text-sm font-semibold text-rojo-quemado transition-colors hover:bg-rojo-quemado/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeletePending ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading && filteredProducts.length === 0 ? (
              <p className="rounded-2xl bg-crema px-4 py-10 text-center text-sepia/60">
                No hay productos para ese filtro.
              </p>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
};
