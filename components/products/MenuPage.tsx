"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { filterProducts } from "@/features/products/search";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { isFrontendSectionEnabled } from "@/lib/site-sections";
import type { SiteContent } from "@/types/site-content";

import { ProductCard } from "./ProductCard";
import { CategoryFilter } from "../search/CategoryFilter";
import { SearchBar } from "../search/SearchBar";
import { SectionUnavailableState } from "../shared/SectionUnavailableState";

export const MenuPage = ({ content }: { content: SiteContent }) => {
  const { products, loading, error } = useCatalogProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );
  const filtered = filterProducts(products, { query: searchQuery, category: activeCategory });
  const orderingEnabled = content.operations.isOrderingEnabled;
  const showMenuHeader = isFrontendSectionEnabled(content.pageSections, "menu.header");
  const showMenuProducts = isFrontendSectionEnabled(content.pageSections, "menu.products");

  if (!showMenuProducts) {
    return (
      <SectionUnavailableState
        eyebrow="Menu no disponible"
        title="Esta seccion esta desactivada por ahora"
        description="El equipo oculto temporalmente el menu publico desde el administrador. Vuelve mas tarde o consulta otras secciones del sitio."
      />
    );
  }

  return (
    <div className="min-h-screen bg-crema">
      {showMenuHeader ? (
        <section className="bg-sepia py-20 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-bold text-crema mb-6"
            >
              {content.menu.title} <span className="text-terracota italic">{content.menu.highlight}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-crema/70 text-lg max-w-2xl mx-auto"
            >
              {content.menu.description}
            </motion.p>
          </div>
        </section>
      ) : null}

      <section className="sticky top-20 z-30 border-b border-beige-tostado/20 bg-crema/95 py-4 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          {!orderingEnabled ? (
            <div className="rounded-2xl border border-mostaza/30 bg-mostaza/10 px-4 py-3 text-left text-sm text-sepia">
              <p className="font-semibold">{content.operations.statusLabel}</p>
              <p className="mt-1 text-sepia/70">{content.operations.notice}</p>
            </div>
          ) : null}

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={content.menu.searchPlaceholder}
          />

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? <p className="text-center text-sepia/60">Cargando menu...</p> : null}
        {error ? <p className="text-center text-rojo-quemado">{error}</p> : null}

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  orderingEnabled={orderingEnabled}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 opacity-50"
            >
              <p className="text-2xl font-serif italic">{content.menu.emptyStateTitle}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Todos");
                }}
                className="mt-4 text-terracota font-bold underline underline-offset-4"
              >
                {content.menu.emptyStateCtaLabel}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
