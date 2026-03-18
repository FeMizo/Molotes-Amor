"use client";

import { COMBO_CATEGORIES } from "@/types/combo";
import type { ComboAdminFormState } from "@/types/admin";
import type { ProductWithInventoryResponse } from "@/services/client/admin-client";
import { formatCurrency } from "@/lib/format";

interface AdminComboFormProps {
  form: ComboAdminFormState;
  setForm: React.Dispatch<React.SetStateAction<ComboAdminFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editing: boolean;
  submitting: boolean;
  submitError: string | null;
  apiError: string | null;
  onCancel: () => void;
  regularPrice: number;
  savings: number;
  productQuery: string;
  setProductQuery: (value: string) => void;
  productCategory: string;
  setProductCategory: (value: string) => void;
  productCategories: string[];
  allProducts: ProductWithInventoryResponse[];
  filteredProducts: ProductWithInventoryResponse[];
}

export const AdminComboForm = ({
  form,
  setForm,
  onSubmit,
  editing,
  submitting,
  submitError,
  apiError,
  onCancel,
  regularPrice,
  savings,
  productQuery,
  setProductQuery,
  productCategory,
  setProductCategory,
  productCategories,
  allProducts,
  filteredProducts,
}: AdminComboFormProps) => (
  <form className="space-y-5" onSubmit={onSubmit}>
    <div className="grid gap-4 md:grid-cols-2">
      <input
        required
        placeholder="Nombre del combo"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      />
      <select
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      >
        {COMBO_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    <textarea
      placeholder="Descripcion opcional"
      value={form.description}
      onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
      className="min-h-24 w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
    />

    <div className="grid gap-4 md:grid-cols-3">
      <input
        placeholder="URL imagen opcional"
        value={form.image}
        onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
        className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none md:col-span-2"
      />
      <input
        required
        placeholder="Precio final"
        type="number"
        min="1"
        value={form.finalPrice}
        onChange={(event) => setForm((prev) => ({ ...prev, finalPrice: event.target.value }))}
        className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      />
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <input
        type="number"
        min="0"
        placeholder="Orden"
        value={form.order}
        onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
        className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      />
      <div className="rounded-xl bg-crema px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">
          Precio normal
        </p>
        <p className="mt-1 font-bold text-sepia">{formatCurrency(regularPrice)}</p>
      </div>
      <div className="rounded-xl bg-crema px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">
          Ahorro sugerido
        </p>
        <p className="mt-1 font-bold text-terracota">{formatCurrency(savings)}</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-4 rounded-xl bg-crema px-4 py-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
        />
        Activo
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
        />
        Destacado
      </label>
    </div>

    <div className="rounded-[1.5rem] border border-beige-tostado/25 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-sepia">Productos del combo</h3>
          <p className="mt-1 text-sm text-sepia/65">
            Busca por nombre o categoria. Los refrescos aparecen aqui igual que el resto del catalogo.
          </p>
        </div>
        <span className="text-sm font-semibold text-sepia/70">
          {form.items.length} seleccionados
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={productQuery}
          onChange={(event) => setProductQuery(event.target.value)}
          placeholder="Buscar producto para agregar"
          className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
        />
        <select
          value={productCategory}
          onChange={(event) => setProductCategory(event.target.value)}
          className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
        >
          {productCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="space-y-3 rounded-[1.5rem] bg-crema/60 p-3">
          {filteredProducts.map((product) => {
            const currentItem = form.items.find((item) => item.productId === product.id);

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-beige-tostado/20 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sepia">{product.name}</p>
                    <p className="mt-1 text-sm text-sepia/65">
                      {product.category} · {formatCurrency(product.price)}
                    </p>
                    <p className="mt-1 text-xs text-sepia/55">
                      Stock {product.inventory.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          items: currentItem
                            ? prev.items.map((item) =>
                                item.productId === product.id
                                  ? {
                                      ...item,
                                      quantity: Math.max(1, item.quantity - 1),
                                    }
                                  : item,
                              )
                            : prev.items,
                        }))
                      }
                      disabled={!currentItem}
                      className="rounded-lg border border-beige-tostado/35 px-2 py-1 text-sm font-bold text-sepia disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-sepia">
                      {currentItem?.quantity ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => {
                          const nextItems = currentItem
                            ? prev.items.map((item) =>
                                item.productId === product.id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item,
                              )
                            : [...prev.items, { productId: product.id, quantity: 1 }];

                          return {
                            ...prev,
                            items: nextItems,
                          };
                        })
                      }
                      className="rounded-lg bg-terracota px-2 py-1 text-sm font-bold text-crema"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-sepia/60">
              No hay productos para ese filtro.
            </p>
          ) : null}
        </div>

        <div className="space-y-3 rounded-[1.5rem] bg-crema/60 p-3">
          {form.items.map((item) => {
            const product = allProducts.find((candidate) => candidate.id === item.productId);

            return (
              <div
                key={item.productId}
                className="rounded-2xl border border-beige-tostado/20 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sepia">
                      {product?.name ?? item.productId}
                    </p>
                    <p className="mt-1 text-sm text-sepia/65">
                      {product?.category ?? "Producto"} · {formatCurrency((product?.price ?? 0) * item.quantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        items: prev.items.filter((candidate) => candidate.productId !== item.productId),
                      }))
                    }
                    className="rounded-lg bg-rojo-quemado/10 px-3 py-2 text-xs font-bold text-rojo-quemado"
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        items: prev.items.flatMap((candidate) => {
                          if (candidate.productId !== item.productId) {
                            return [candidate];
                          }

                          return candidate.quantity <= 1
                            ? []
                            : [{ ...candidate, quantity: candidate.quantity - 1 }];
                        }),
                      }))
                    }
                    className="rounded-lg border border-beige-tostado/35 px-2 py-1 text-sm font-bold text-sepia"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center font-bold text-sepia">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        items: prev.items.map((candidate) =>
                          candidate.productId === item.productId
                            ? { ...candidate, quantity: candidate.quantity + 1 }
                            : candidate,
                        ),
                      }))
                    }
                    className="rounded-lg bg-terracota px-2 py-1 text-sm font-bold text-crema"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
          {form.items.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-sepia/60">
              Selecciona productos del lado izquierdo para armar el combo.
            </p>
          ) : null}
        </div>
      </div>
    </div>

    {submitError ? <p className="font-semibold text-rojo-quemado">{submitError}</p> : null}
    {apiError ? <p className="font-semibold text-rojo-quemado">{apiError}</p> : null}

    <div className="flex flex-wrap gap-3">
      <button
        disabled={submitting}
        className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:opacity-60"
      >
        {submitting ? "Guardando..." : editing ? "Guardar combo" : "Crear combo"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia disabled:opacity-60"
      >
        Cancelar
      </button>
    </div>
  </form>
);
