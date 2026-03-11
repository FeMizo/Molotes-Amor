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
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [form, setForm] = useState<ProductAdminFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

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
      minStock: product.inventory.minStock !== undefined ? String(product.inventory.minStock) : "",
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
    }
  };

  const toggleFlags = async (id: string, key: "available" | "featured", currentValue: boolean) => {
    try {
      await updateProduct(id, { [key]: !currentValue });
    } catch {
      setSubmitError("No se pudo actualizar el estado del producto.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este producto?")) {
      return;
    }
    try {
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      setStatusMessage("Producto eliminado.");
    } catch {
      setSubmitError("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1.8fr] gap-8">
      <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-sepia mb-4">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <form className="space-y-3" onSubmit={submit}>
          <input
            required
            placeholder="Nombre"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
          />
          <input
            required
            placeholder="Descripcion corta"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
          />
          <textarea
            required
            placeholder="Descripcion larga"
            value={form.longDescription}
            onChange={(event) => setForm((prev) => ({ ...prev, longDescription: event.target.value }))}
            className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota min-h-24"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Precio"
              type="number"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
            />
            <input
              placeholder="Precio anterior"
              type="number"
              value={form.previousPrice}
              onChange={(event) => setForm((prev) => ({ ...prev, previousPrice: event.target.value }))}
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Categoria"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
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
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
            />
          </div>
          <input
            placeholder="URL imagen"
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
          />
          <input
            placeholder="Tags separados por coma"
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
            />
            <input
              type="number"
              placeholder="Stock minimo"
              value={form.minStock}
              onChange={(event) => setForm((prev) => ({ ...prev, minStock: event.target.value }))}
              className="px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
            />
            <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
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

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-sepia">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(event) => setForm((prev) => ({ ...prev, available: event.target.checked }))}
              />
              Disponible
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

          {statusMessage ? <p className="text-olivo font-semibold">{statusMessage}</p> : null}
          {submitError ? <p className="text-rojo-quemado font-semibold">{submitError}</p> : null}
          {error ? <p className="text-rojo-quemado font-semibold">{error}</p> : null}

          <div className="flex gap-2">
            <button className="px-5 py-3 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl transition-colors">
              {editingId ? "Guardar cambios" : "Crear producto"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 bg-beige-tostado/30 text-sepia font-bold rounded-xl"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold text-sepia">Listado de productos</h2>
          <span className="text-sm font-semibold text-sepia/70">{loading ? "Cargando..." : `${products.length} items`}</span>
        </div>

        {categories.length > 0 ? (
          <p className="text-sm text-sepia/60 mb-3">Categorias: {categories.join(", ")}</p>
        ) : null}

        <div className="space-y-3 max-h-[700px] overflow-auto pr-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-beige-tostado/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-sepia">{product.name}</h3>
                <p className="text-sm text-sepia/70">
                  ${product.price} · {product.category} · Stock: {product.inventory.stock}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillFormForEdit(product.id)}
                  className="px-3 py-1.5 rounded-lg border border-beige-tostado/40 text-sm font-semibold text-sepia hover:border-terracota"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => toggleFlags(product.id, "available", product.available)}
                  className="px-3 py-1.5 rounded-lg border border-beige-tostado/40 text-sm font-semibold text-sepia hover:border-terracota"
                >
                  {product.available ? "Desactivar" : "Activar"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFlags(product.id, "featured", product.featured)}
                  className="px-3 py-1.5 rounded-lg bg-beige-tostado/30 text-sm font-semibold text-sepia hover:bg-beige-tostado/50"
                >
                  {product.featured ? "Quitar destacado" : "Destacar"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(product.id)}
                  className="px-3 py-1.5 rounded-lg bg-rojo-quemado/10 text-sm font-semibold text-rojo-quemado hover:bg-rojo-quemado/20"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {!loading && products.length === 0 ? (
            <p className="text-sepia/60 text-center py-10">No hay productos cargados.</p>
          ) : null}
        </div>
      </article>
    </div>
  );
};
