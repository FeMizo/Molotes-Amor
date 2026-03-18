"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import { isFrontendSectionEnabled } from "@/lib/site-sections";
import type { SiteContent } from "@/types/site-content";

export const ContactPage = ({ content }: { content: SiteContent }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isFrontendSectionEnabled(content.pageSections, "contact.page")) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
            Seccion desactivada
          </p>
          <h1 className="mt-3 text-4xl font-serif font-bold text-sepia">
            Contacto no esta visible por ahora
          </h1>
          <p className="mt-4 text-sepia/70">
            Esta pagina fue deshabilitada temporalmente desde el panel administrativo.
          </p>
        </div>
      </section>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-crema min-h-screen">
      <section className="bg-sepia py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-crema mb-6"
          >
            {content.contact.title} <span className="text-terracota italic">{content.contact.highlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-crema/70 text-lg max-w-2xl mx-auto"
          >
            {content.contact.description}
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-sepia mb-8">{content.contact.infoTitle}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-terracota/10 rounded-xl flex items-center justify-center text-terracota group-hover:bg-terracota group-hover:text-crema transition-all duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sepia">{content.contact.addressLabel}</h4>
                    <p className="text-sepia/70">{content.contact.addressValue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-terracota/10 rounded-xl flex items-center justify-center text-terracota group-hover:bg-terracota group-hover:text-crema transition-all duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sepia">{content.contact.phoneLabel}</h4>
                    <p className="text-sepia/70">{content.contact.phoneValue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-terracota/10 rounded-xl flex items-center justify-center text-terracota group-hover:bg-terracota group-hover:text-crema transition-all duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sepia">{content.contact.emailLabel}</h4>
                    <p className="text-sepia/70">{content.contact.emailValue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-terracota/10 rounded-xl flex items-center justify-center text-terracota group-hover:bg-terracota group-hover:text-crema transition-all duration-300">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sepia">{content.contact.hoursLabel}</h4>
                    <p className="text-sepia/70">{content.contact.hoursValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 bg-beige-tostado/20 rounded-3xl border-2 border-dashed border-beige-tostado/40 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')] opacity-20 grayscale group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 text-center p-6">
                <MapPin size={48} className="text-terracota mx-auto mb-4" />
                <p className="font-serif italic text-sepia">{content.contact.mapTitle}</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-widest text-terracota underline underline-offset-4">
                  {content.contact.mapCtaLabel}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-beige-tostado/20">
            <h3 className="text-2xl font-serif font-bold text-sepia mb-8">{content.contact.formTitle}</h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
              >
                <div className="w-20 h-20 bg-olivo/10 rounded-full flex items-center justify-center text-olivo">
                  <CheckCircle size={48} />
                </div>
                <h4 className="text-2xl font-serif font-bold text-sepia">{content.contact.successTitle}</h4>
                <p className="text-sepia/70">{content.contact.successDescription}</p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-terracota font-bold underline underline-offset-4"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Nombre</label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full px-6 py-4 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Asunto</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota transition-colors"
                    placeholder="En que podemos ayudarte?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Mensaje</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-6 py-4 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota transition-colors resize-none"
                    placeholder="Escribe tu mensaje aqui..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl shadow-lg shadow-terracota/20 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>{content.contact.submitLabel}</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
