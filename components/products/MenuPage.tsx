"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { filterProducts } from "@/features/products/search";
import { useCatalogProducts } from "@/hooks/use-catalog-products";

import { ProductCard } from "./ProductCard";
import { CategoryFilter } from "../search/CategoryFilter";
import { SearchBar } from "../search/SearchBar";

export const MenuPage = () => {
  const { products, loading, error } = useCatalogProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filtered = useMemo(
    () => filterProducts(products, { query: searchQuery, category: activeCategory }),
    [products, searchQuery, activeCategory],
  );

  return (
    <div className="min-h-screen bg-crema">
      <section className="bg-sepia py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-crema mb-6"
          >
            Nuestro <span className="text-terracota italic">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-crema/70 text-lg max-w-2xl mx-auto"
          >
            Explora nuestra variedad de molotes artesanales, preparados con ingredientes frescos y sazon
            tradicional poblano.
          </motion.p>
        </div>
      </section>

      <section className="sticky top-20 z-30 bg-crema/90 backdrop-blur-md border-b border-beige-tostado/20 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? <p className="text-center text-sepia/60">Cargando menu...</p> : null}
        {error ? <p className="text-center text-rojo-quemado mb-6">{error}</p> : null}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 opacity-50"
            >
              <p className="text-2xl font-serif italic">
                No encontramos molotes que coincidan con tu busqueda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Todos");
                }}
                className="mt-4 text-terracota font-bold underline underline-offset-4"
              >
                Ver todo el menu
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
