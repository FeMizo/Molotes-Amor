"use client";

import { useMemo, useState } from "react";
import { BarChart3, Boxes, ImagePlus, Megaphone, PackageCheck, Settings, Tags, Users } from "lucide-react";

import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types/product";

const futureModules = [
  { label: "Pedidos", icon: PackageCheck },
  { label: "Categorías", icon: Tags },
  { label: "Promociones", icon: Megaphone },
  { label: "Banners", icon: ImagePlus },
  { label: "Clientes", icon: Users },
  { label: "Analítica", icon: BarChart3 },
  { label: "Inventario", icon: Boxes },
  { label: "Configuraciones", icon: Settings },
];

export const AdminBase = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");

  const activeCount = useMemo(() => products.filter((product) => product.available).length, [products]);

  const toggleAvailable = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, available: !product.available } : product,
      ),
    );
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, featured: !product.featured } : product)),
    );
  };

  const createProduct = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName.trim() || !formPrice.trim()) {
      return;
    }

    const newProduct: Product = {
      id: `new-${Date.now()}`,
      slug: formName.toLowerCase().replaceAll(" ", "-"),
      name: formName,
      description: "Producto creado desde el panel administrador.",
      longDescription: "Producto creado desde el panel administrador.",
      price: Number(formPrice),
      category: "Tradicionales",
      image: PRODUCTS[0].image,
      featured: false,
      available: true,
      tags: ["nuevo"],
    };

    setProducts((prev) => [newProduct, ...prev]);
    setFormName("");
    setFormPrice("");
  };

  return (
    <div className="bg-crema min-h-screen">
      <section className="bg-sepia py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-crema">
            Panel <span className="text-terracota italic">Administrador</span>
          </h1>
          <p className="text-crema/70 mt-4 max-w-2xl">
            Base técnica preparada para crecer a módulos profesionales sin romper el diseño actual.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <p className="text-sepia/70">Productos activos</p>
          <p className="text-4xl font-serif font-bold text-sepia mt-2">{activeCount}</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <p className="text-sepia/70">Total productos</p>
          <p className="text-4xl font-serif font-bold text-sepia mt-2">{products.length}</p>
        </article>
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <p className="text-sepia/70">Módulos futuros listos</p>
          <p className="text-4xl font-serif font-bold text-sepia mt-2">{futureModules.length}</p>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8">
        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-sepia mb-4">Crear producto</h2>
          <form onSubmit={createProduct} className="space-y-4">
            <input
              type="text"
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
              placeholder="Nombre del producto"
              className="w-full px-4 py-3 bg-crema border border-beige-tostado/40 rounded-xl focus:outline-none focus:border-terracota"
            />
            <input
              type="number"
              value={formPrice}
              onChange={(event) => setFormPrice(event.target.value)}
              placeholder="Precio"
              className="w-full px-4 py-3 bg-crema border border-beige-tostado/40 rounded-xl focus:outline-none focus:border-terracota"
            />
            <button className="w-full py-3 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl transition-colors">
              Guardar producto
            </button>
          </form>
        </article>

        <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-sepia mb-4">Gestión de productos</h2>
          <div className="space-y-4 max-h-[480px] overflow-auto pr-1">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-beige-tostado/20 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-sepia">{product.name}</h3>
                  <p className="text-sepia/70 text-sm">
                    ${product.price} · {product.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAvailable(product.id)}
                    className="px-3 py-1.5 rounded-lg border border-beige-tostado/40 text-sm font-semibold text-sepia hover:border-terracota"
                  >
                    {product.available ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(product.id)}
                    className="px-3 py-1.5 rounded-lg bg-beige-tostado/30 text-sm font-semibold text-sepia hover:bg-beige-tostado/50"
                  >
                    {product.featured ? "Quitar destacado" : "Destacar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-serif font-bold text-sepia mb-4">Módulos futuros preparados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {futureModules.map((module) => {
            const Icon = module.icon;
            return (
              <article
                key={module.label}
                className="bg-white rounded-xl p-4 border border-beige-tostado/25 flex items-center gap-3"
              >
                <Icon size={18} className="text-terracota" />
                <span className="font-semibold text-sepia">{module.label}</span>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
