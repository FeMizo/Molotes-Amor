"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { PRODUCTS } from "@/data/products";
import { featuredProducts } from "@/features/products/search";

import { Hero } from "./Hero";
import { ProductCard } from "../products/ProductCard";

export const HomePage = () => {
  const topProducts = featuredProducts(PRODUCTS);

  return (
    <div className="flex flex-col">
      <Hero />

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-sepia mb-4">
              Favoritos de la Casa
            </h2>
            <p className="text-lg text-sepia/70">
              Una selección de nuestros molotes más pedidos, preparados con el sazón tradicional que nos
              distingue.
            </p>
          </div>
          <Link
            href="/menu"
            className="flex items-center space-x-2 text-terracota font-bold hover:text-rojo-quemado transition-colors group"
          >
            <span>Ver menú completo</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
                    src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80"
                    alt="Proceso Artesanal"
                    className="w-full h-full object-cover aspect-square"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-mostaza rounded-full flex items-center justify-center text-center p-4 transform -rotate-12 shadow-xl border-4 border-white">
                  <span className="text-canela font-bold text-sm uppercase tracking-tighter">
                    Masa de maíz 100% nixtamalizado
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-sepia leading-tight">
                Calidad que se siente en <span className="text-terracota italic">cada mordida</span>
              </h3>
              <p className="text-lg text-sepia/70 leading-relaxed">
                Nuestros molotes son preparados al momento, siguiendo las recetas que han pasado de generación
                en generación. Utilizamos ingredientes locales frescos y el mejor aceite para asegurar esa
                textura crujiente inigualable.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="block text-3xl font-serif font-bold text-terracota mb-1">01.</span>
                  <h4 className="font-bold text-sepia mb-2">Ingredientes Locales</h4>
                  <p className="text-sm text-sepia/60">Apoyamos a los productores de nuestra región.</p>
                </div>
                <div>
                  <span className="block text-3xl font-serif font-bold text-terracota mb-1">02.</span>
                  <h4 className="font-bold text-sepia mb-2">Receta Secreta</h4>
                  <p className="text-sm text-sepia/60">
                    El sazón que nos hace únicos desde hace décadas.
                  </p>
                </div>
              </div>
              <Link
                href="/nosotros"
                className="inline-block px-8 py-4 bg-white border-2 border-beige-tostado text-sepia font-bold rounded-xl hover:bg-beige-tostado/10 transition-all duration-300"
              >
                Conoce nuestra historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-crema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-sepia">Lo que dicen nuestros clientes</h2>
            <div className="w-16 h-1 bg-terracota mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sofía García",
                text: "El de huitlacoche es simplemente espectacular. Me recordó a los que hacía mi abuela.",
                role: "Cliente frecuente",
              },
              {
                name: "Marco Antonio",
                text: "Excelente servicio y la presentación es impecable. El carrito web es súper fácil de usar.",
                role: "Foodie Local",
              },
              {
                name: "Lucía Méndez",
                text: "Crujientes y calientitos. Llegaron perfecto a mi casa. ¡Altamente recomendados!",
                role: "Cliente a domicilio",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
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
    </div>
  );
};
