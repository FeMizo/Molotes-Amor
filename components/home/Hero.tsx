"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import type { HomeContent } from "@/types/site-content";

export const Hero = ({
  content,
  showPrimaryCta,
  showSecondaryCta,
}: {
  content: HomeContent;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
}) => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-crema py-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-terracota blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-mostaza blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-olivo/10 text-olivo text-xs font-bold uppercase tracking-[0.2em]">
              {content.heroBadge}
            </span>
            <h2 className="text-6xl md:text-8xl font-serif font-bold text-sepia leading-[0.9] mb-8">
              {content.heroTitle} <br />
              <span className="text-terracota italic">{content.heroHighlight}</span>
            </h2>
            <p className="text-xl text-sepia/80 mb-10 max-w-lg leading-relaxed">{content.heroDescription}</p>
            {showPrimaryCta || showSecondaryCta ? (
              <div className="flex flex-col sm:flex-row gap-4">
                {showPrimaryCta ? (
                  <Link
                    href="/menu"
                    className="px-8 py-4 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl shadow-xl shadow-terracota/20 transition-all duration-300 flex items-center justify-center group"
                  >
                    {content.heroPrimaryCtaLabel}
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : null}
                {showSecondaryCta ? (
                  <Link
                    href="/nosotros"
                    className="px-8 py-4 bg-white border-2 border-beige-tostado text-sepia font-bold rounded-xl hover:bg-beige-tostado/10 transition-all duration-300 text-center"
                  >
                    {content.heroSecondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src={content.heroImage}
                alt="Molotes Tradicionales"
                className="w-full h-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-beige-tostado/30 max-w-[200px]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-beige-tostado overflow-hidden"
                    >
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Cliente" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-sepia">{content.heroFloatingCount}</span>
              </div>
              <p className="text-sm font-medium text-sepia">&quot;{content.heroFloatingQuote}&quot;</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
