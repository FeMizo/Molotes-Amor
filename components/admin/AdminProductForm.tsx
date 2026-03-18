"use client";

import { PRODUCT_CATEGORIES } from "@/types/product";
import type { ProductAdminFormState } from "@/types/admin";

const badgeOptions: Array<ProductAdminFormState["badge"]> = [
  "",
  "Popular",
  "Nuevo",
  "Mas pedido",
];

interface AdminProductFormProps {
  form: ProductAdminFormState;
  setForm: React.Dispatch<React.SetStateAction<ProductAdminFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editing: boolean;
  submitting: boolean;
  statusMessage: string | null;
  submitError: string | null;
  apiError: string | null;
  onCancel: () => void;
}

export const AdminProductForm = ({
  form,
  setForm,
  onSubmit,
  editing,
  submitting,
  statusMessage,
  submitError,
  apiError,
  onCancel,
}: AdminProductFormProps) => (
  <form className="space-y-4" onSubmit={onSubmit}>
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
      <select
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={form.badge}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            badge: event.target.value as ProductAdminFormState["badge"],
          }))
        }
        className="rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
      >
        {badgeOptions.map((badge) => (
          <option key={badge || "none"} value={badge}>
            {badge || "Sin badge"}
          </option>
        ))}
      </select>
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
      <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
        <input
          type="checkbox"
          checked={form.badge === "Nuevo"}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              badge: event.target.checked ? "Nuevo" : prev.badge === "Nuevo" ? "" : prev.badge,
            }))
          }
        />
        Marcar como nuevo
      </label>
    </div>

    {statusMessage ? <p className="font-semibold text-olivo">{statusMessage}</p> : null}
    {submitError ? <p className="font-semibold text-rojo-quemado">{submitError}</p> : null}
    {apiError ? <p className="font-semibold text-rojo-quemado">{apiError}</p> : null}

    <div className="flex flex-wrap gap-3">
      <button
        disabled={submitting}
        className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancelar
      </button>
    </div>
  </form>
);
