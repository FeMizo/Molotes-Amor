"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { featuredProducts } from "@/features/products/search";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { getOrderedSectionsForPrefix, isFrontendSectionEnabled } from "@/lib/site-sections";
import { useAccountStore } from "@/store/account-store";
import type { SiteContent } from "@/types/site-content";

import { Hero } from "./Hero";
import { ProductCard } from "../products/ProductCard";

export const HomePage = ({ content }: { content: SiteContent }) => {
  const { products } = useCatalogProducts();
  const favoriteProductIds = useAccountStore((state) => state.favoriteProductIds);
  const topProducts = featuredProducts(products);
  const favoriteProducts = products.filter((product) => favoriteProductIds.includes(product.id));
  const menuEnabled = isFrontendSectionEnabled(content.pageSections, "menu.products");
  const aboutEnabled = isFrontendSectionEnabled(content.pageSections, "about.page");
  const orderingEnabled = content.operations.isOrderingEnabled;
  const homeSections = getOrderedSectionsForPrefix(content.pageSections, "home");

  const sectionRegistry: Record<string, React.ReactNode> = {
    "home.hero": (
      <Hero
        content={content.home}
        showPrimaryCta={menuEnabled}
        showSecondaryCta={aboutEnabled}
      />
    ),
    "home.featured": (
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-sepia mb-4">
              {content.home.featuredTitle}
            </h2>
            <p className="text-lg text-sepia/70">{content.home.featuredDescription}</p>
          </div>
          {menuEnabled ? (
            <Link
              href="/menu"
              className="flex items-center space-x-2 text-terracota font-bold hover:text-rojo-quemado transition-colors group"
            >
              <span>{content.home.featuredCtaLabel}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} orderingEnabled={orderingEnabled} />
          ))}
        </div>
      </section>
    ),
    "home.favorites": (
      <section className="pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[2rem] border border-beige-tostado/25 bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                {content.home.favoritesEyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
                {content.home.favoritesTitle}
              </h2>
              <p className="mt-2 text-sepia/65">{content.home.favoritesDescription}</p>
            </div>
            <Link href="/mi-cuenta" className="font-bold text-terracota">
              {content.home.favoritesCtaLabel}
            </Link>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} orderingEnabled={orderingEnabled} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-beige-tostado/35 bg-crema px-6 py-10 text-center">
              <p className="text-xl font-serif font-bold text-sepia">
                {content.home.favoritesEmptyTitle}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sepia/65">
                {content.home.favoritesEmptyDescription}
              </p>
            </div>
          )}
        </div>
      </section>
    ),
    "home.story": (
      <section className="bg-beige-tostado/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                  <img
                    src={content.home.storyImage}
                    alt="Proceso artesanal"
                    className="w-full h-full object-cover aspect-square"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-mostaza rounded-full flex items-center justify-center text-center p-4 transform -rotate-12 shadow-xl border-4 border-white">
                  <span className="text-canela font-bold text-sm uppercase tracking-tighter">
                    {content.home.storyBadge}
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-sepia leading-tight">
                {content.home.storyTitle}{" "}
                <span className="text-terracota italic">{content.home.storyHighlight}</span>
              </h3>
              <p className="text-lg text-sepia/70 leading-relaxed">{content.home.storyDescription}</p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="block text-3xl font-serif font-bold text-terracota mb-1">01.</span>
                  <h4 className="font-bold text-sepia mb-2">{content.home.storyItemOneTitle}</h4>
                  <p className="text-sm text-sepia/60">{content.home.storyItemOneDescription}</p>
                </div>
                <div>
                  <span className="block text-3xl font-serif font-bold text-terracota mb-1">02.</span>
                  <h4 className="font-bold text-sepia mb-2">{content.home.storyItemTwoTitle}</h4>
                  <p className="text-sm text-sepia/60">{content.home.storyItemTwoDescription}</p>
                </div>
              </div>
              {aboutEnabled ? (
                <Link
                  href="/nosotros"
                  className="inline-block px-8 py-4 bg-white border-2 border-beige-tostado text-sepia font-bold rounded-xl hover:bg-beige-tostado/10 transition-all duration-300"
                >
                  {content.home.storyCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    ),
    "home.testimonials": (
      <section className="py-24 bg-crema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-sepia">{content.home.testimonialsTitle}</h2>
            <div className="w-16 h-1 bg-terracota mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: content.home.testimonialOneName,
                text: content.home.testimonialOneText,
                role: content.home.testimonialOneRole,
              },
              {
                name: content.home.testimonialTwoName,
                text: content.home.testimonialTwoText,
                role: content.home.testimonialTwoRole,
              },
              {
                name: content.home.testimonialThreeName,
                text: content.home.testimonialThreeText,
                role: content.home.testimonialThreeRole,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-beige-tostado/20 shadow-sm italic text-sepia/80"
              >
                <p className="mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center space-x-3 not-italic">
                  <div className="w-10 h-10 rounded-full bg-beige-tostado/30 flex items-center justify-center font-bold text-terracota">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sepia text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-sepia/50">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    ),
    "home.promotions": (
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-beige-tostado/20 bg-sepia px-8 py-10 text-crema shadow-sm lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-mostaza">
                {content.promotions.eyebrow}
              </p>
              <h2 className="mt-3 text-4xl font-serif font-bold md:text-5xl">
                {content.promotions.title}{" "}
                <span className="text-terracota italic">{content.promotions.highlight}</span>
              </h2>
              <p className="mt-4 max-w-2xl text-crema/75">{content.promotions.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[content.promotions.benefitOne, content.promotions.benefitTwo, content.promotions.benefitThree].map(
                  (benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full border border-crema/20 bg-crema/10 px-4 py-2 text-sm font-semibold"
                    >
                      {benefit}
                    </span>
                  ),
                )}
              </div>
              {menuEnabled ? (
                <Link
                  href="/menu"
                  className="mt-8 inline-flex rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
                >
                  {content.promotions.primaryCtaLabel}
                </Link>
              ) : null}
            </div>
            <div className="rounded-[2rem] border border-crema/15 bg-crema/10 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-mostaza">Uso sugerido</p>
              <p className="mt-4 text-lg font-serif font-bold">{content.promotions.secondaryText}</p>
              <p className="mt-4 text-sm text-crema/70">
                Esta seccion queda lista para crecer despues a cupones, combos o campañas temporales.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <div className="flex flex-col">
      {homeSections.map((section) => (
        <div key={section.key}>{sectionRegistry[section.key]}</div>
      ))}
    </div>
  );
};
