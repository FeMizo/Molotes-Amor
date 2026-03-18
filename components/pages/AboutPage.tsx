"use client";

import { motion } from "motion/react";
import { Heart, History, Users, Utensils } from "lucide-react";

import { isFrontendSectionEnabled } from "@/lib/site-sections";
import type { SiteContent } from "@/types/site-content";

const Star = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const AboutPage = ({ content }: { content: SiteContent }) => {
  if (!isFrontendSectionEnabled(content.pageSections, "about.page")) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
            Seccion desactivada
          </p>
          <h1 className="mt-3 text-4xl font-serif font-bold text-sepia">
            Nosotros no esta visible por ahora
          </h1>
          <p className="mt-4 text-sepia/70">
            Esta pagina fue deshabilitada temporalmente desde el panel administrativo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-crema">
      <section className="relative py-32 bg-sepia overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-mostaza font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
          >
            {content.about.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-crema mb-8"
          >
            {content.about.title} <br />
            <span className="text-terracota italic">{content.about.highlight}</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-sepia">{content.about.introTitle}</h2>
            <div className="w-20 h-1 bg-terracota" />
            <p className="text-lg text-sepia/70 leading-relaxed">{content.about.introDescriptionOne}</p>
            <p className="text-lg text-sepia/70 leading-relaxed">{content.about.introDescriptionTwo}</p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-terracota/10 rounded-lg text-terracota">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sepia">{content.about.valueOneTitle}</h4>
                  <p className="text-sm text-sepia/60">{content.about.valueOneDescription}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-terracota/10 rounded-lg text-terracota">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sepia">{content.about.valueTwoTitle}</h4>
                  <p className="text-sm text-sepia/60">{content.about.valueTwoDescription}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform -rotate-2">
              <img
                src={content.about.image}
                alt="Nuestra Cocina"
                className="w-full h-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige-tostado/10 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-sepia">{content.about.pillarsTitle}</h2>
            <p className="text-sepia/60 mt-4 italic">{content.about.pillarsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Utensils size={32} />,
                title: content.about.pillarOneTitle,
                desc: content.about.pillarOneDescription,
              },
              {
                icon: <History size={32} />,
                title: content.about.pillarTwoTitle,
                desc: content.about.pillarTwoDescription,
              },
              {
                icon: <Star size={32} />,
                title: content.about.pillarThreeTitle,
                desc: content.about.pillarThreeDescription,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-beige-tostado/20 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-terracota/10 rounded-2xl flex items-center justify-center text-terracota mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-sepia">{item.title}</h3>
                <p className="text-sepia/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
