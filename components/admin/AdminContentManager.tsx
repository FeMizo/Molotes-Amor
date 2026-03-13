"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheckBig, Save, X } from "lucide-react";

import { useAdminSiteContent } from "@/hooks/use-admin-site-content";
import type { SiteContent } from "@/types/site-content";

type SectionKey = keyof SiteContent;

interface FieldDefinition {
  section: SectionKey;
  key: string;
  label: string;
  kind?: "input" | "textarea";
}

interface EditorSection {
  id: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
}

const editorSections: EditorSection[] = [
  {
    id: "home",
    title: "Home",
    description: "Hero, destacados, historia y testimonios.",
    fields: [
      { section: "home", key: "heroBadge", label: "Badge hero" },
      { section: "home", key: "heroTitle", label: "Titulo hero" },
      { section: "home", key: "heroHighlight", label: "Resaltado hero" },
      { section: "home", key: "heroDescription", label: "Descripcion hero", kind: "textarea" },
      { section: "home", key: "heroPrimaryCtaLabel", label: "CTA principal" },
      { section: "home", key: "heroSecondaryCtaLabel", label: "CTA secundaria" },
      { section: "home", key: "heroImage", label: "Imagen hero" },
      { section: "home", key: "heroFloatingCount", label: "Conteo flotante" },
      { section: "home", key: "heroFloatingQuote", label: "Texto flotante", kind: "textarea" },
      { section: "home", key: "featuredTitle", label: "Titulo destacados" },
      { section: "home", key: "featuredDescription", label: "Descripcion destacados", kind: "textarea" },
      { section: "home", key: "featuredCtaLabel", label: "CTA destacados" },
      { section: "home", key: "storyTitle", label: "Titulo bloque historia" },
      { section: "home", key: "storyHighlight", label: "Resaltado bloque historia" },
      { section: "home", key: "storyDescription", label: "Descripcion bloque historia", kind: "textarea" },
      { section: "home", key: "storyImage", label: "Imagen bloque historia" },
      { section: "home", key: "storyBadge", label: "Badge bloque historia" },
      { section: "home", key: "storyItemOneTitle", label: "Item 1 titulo" },
      { section: "home", key: "storyItemOneDescription", label: "Item 1 descripcion" },
      { section: "home", key: "storyItemTwoTitle", label: "Item 2 titulo" },
      { section: "home", key: "storyItemTwoDescription", label: "Item 2 descripcion" },
      { section: "home", key: "storyCtaLabel", label: "CTA historia" },
      { section: "home", key: "testimonialsTitle", label: "Titulo testimonios" },
      { section: "home", key: "testimonialOneName", label: "Testimonio 1 nombre" },
      { section: "home", key: "testimonialOneText", label: "Testimonio 1 texto", kind: "textarea" },
      { section: "home", key: "testimonialOneRole", label: "Testimonio 1 rol" },
      { section: "home", key: "testimonialTwoName", label: "Testimonio 2 nombre" },
      { section: "home", key: "testimonialTwoText", label: "Testimonio 2 texto", kind: "textarea" },
      { section: "home", key: "testimonialTwoRole", label: "Testimonio 2 rol" },
      { section: "home", key: "testimonialThreeName", label: "Testimonio 3 nombre" },
      { section: "home", key: "testimonialThreeText", label: "Testimonio 3 texto", kind: "textarea" },
      { section: "home", key: "testimonialThreeRole", label: "Testimonio 3 rol" },
    ],
  },
  {
    id: "menu",
    title: "Menu",
    description: "Cabecera y textos del filtro.",
    fields: [
      { section: "menu", key: "title", label: "Titulo" },
      { section: "menu", key: "highlight", label: "Resaltado" },
      { section: "menu", key: "description", label: "Descripcion", kind: "textarea" },
      { section: "menu", key: "searchPlaceholder", label: "Placeholder buscador" },
      { section: "menu", key: "emptyStateTitle", label: "Mensaje sin resultados", kind: "textarea" },
      { section: "menu", key: "emptyStateCtaLabel", label: "CTA sin resultados" },
    ],
  },
  {
    id: "about",
    title: "Nosotros",
    description: "Historia, valores y pilares.",
    fields: [
      { section: "about", key: "eyebrow", label: "Eyebrow" },
      { section: "about", key: "title", label: "Titulo" },
      { section: "about", key: "highlight", label: "Resaltado" },
      { section: "about", key: "introTitle", label: "Titulo introduccion" },
      { section: "about", key: "introDescriptionOne", label: "Parrafo 1", kind: "textarea" },
      { section: "about", key: "introDescriptionTwo", label: "Parrafo 2", kind: "textarea" },
      { section: "about", key: "image", label: "Imagen principal" },
      { section: "about", key: "valueOneTitle", label: "Valor 1 titulo" },
      { section: "about", key: "valueOneDescription", label: "Valor 1 descripcion" },
      { section: "about", key: "valueTwoTitle", label: "Valor 2 titulo" },
      { section: "about", key: "valueTwoDescription", label: "Valor 2 descripcion" },
      { section: "about", key: "pillarsTitle", label: "Titulo pilares" },
      { section: "about", key: "pillarsSubtitle", label: "Subtitulo pilares" },
      { section: "about", key: "pillarOneTitle", label: "Pilar 1 titulo" },
      { section: "about", key: "pillarOneDescription", label: "Pilar 1 descripcion", kind: "textarea" },
      { section: "about", key: "pillarTwoTitle", label: "Pilar 2 titulo" },
      { section: "about", key: "pillarTwoDescription", label: "Pilar 2 descripcion", kind: "textarea" },
      { section: "about", key: "pillarThreeTitle", label: "Pilar 3 titulo" },
      { section: "about", key: "pillarThreeDescription", label: "Pilar 3 descripcion", kind: "textarea" },
    ],
  },
  {
    id: "contact",
    title: "Contacto",
    description: "Encabezado, datos y mensajes del formulario.",
    fields: [
      { section: "contact", key: "title", label: "Titulo" },
      { section: "contact", key: "highlight", label: "Resaltado" },
      { section: "contact", key: "description", label: "Descripcion", kind: "textarea" },
      { section: "contact", key: "infoTitle", label: "Titulo informacion" },
      { section: "contact", key: "addressLabel", label: "Etiqueta direccion" },
      { section: "contact", key: "addressValue", label: "Direccion", kind: "textarea" },
      { section: "contact", key: "phoneLabel", label: "Etiqueta telefono" },
      { section: "contact", key: "phoneValue", label: "Telefono" },
      { section: "contact", key: "emailLabel", label: "Etiqueta email" },
      { section: "contact", key: "emailValue", label: "Email" },
      { section: "contact", key: "hoursLabel", label: "Etiqueta horario" },
      { section: "contact", key: "hoursValue", label: "Horario" },
      { section: "contact", key: "mapTitle", label: "Titulo mapa" },
      { section: "contact", key: "mapCtaLabel", label: "CTA mapa" },
      { section: "contact", key: "formTitle", label: "Titulo formulario" },
      { section: "contact", key: "successTitle", label: "Titulo exito" },
      { section: "contact", key: "successDescription", label: "Descripcion exito", kind: "textarea" },
      { section: "contact", key: "submitLabel", label: "CTA formulario" },
    ],
  },
];

const getFieldValue = (content: SiteContent, field: FieldDefinition): string => {
  const section = content[field.section] as unknown as Record<string, string>;
  return section[field.key] ?? "";
};

const setFieldValue = (content: SiteContent, field: FieldDefinition, value: string): SiteContent => ({
  ...content,
  [field.section]: {
    ...content[field.section],
    [field.key]: value,
  },
});

export const AdminContentManager = () => {
  const { content, loading, error, updateContent } = useAdminSiteContent();
  const [form, setForm] = useState<SiteContent | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const savedNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = useMemo(() => {
    if (!form || !content) {
      return false;
    }
    return JSON.stringify(form) !== JSON.stringify(content);
  }, [form, content]);

  useEffect(() => {
    if (content) {
      setForm(content);
    }
  }, [content]);

  useEffect(() => {
    return () => {
      if (savedNoticeTimerRef.current) {
        clearTimeout(savedNoticeTimerRef.current);
      }
    };
  }, []);

  const openSavedNotice = () => {
    setSavedNoticeVisible(true);
    if (savedNoticeTimerRef.current) {
      clearTimeout(savedNoticeTimerRef.current);
    }
    savedNoticeTimerRef.current = setTimeout(() => {
      setSavedNoticeVisible(false);
    }, 5000);
  };

  const closeSavedNotice = () => {
    setSavedNoticeVisible(false);
    if (savedNoticeTimerRef.current) {
      clearTimeout(savedNoticeTimerRef.current);
      savedNoticeTimerRef.current = null;
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await updateContent(form);
      openSavedNotice();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo guardar el contenido.");
      closeSavedNotice();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article id="site-content" className="relative bg-white rounded-2xl p-6 pb-32 border border-beige-tostado/30 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-sepia">Contenido del sitio</h2>
          <p className="text-sepia/70 mt-1">Edita Home, Menu, Nosotros y Contacto desde el dashboard.</p>
        </div>
        <span className="text-sm font-semibold text-sepia/60">{loading ? "Cargando..." : "Listo para editar"}</span>
      </div>

      {error ? <p className="text-rojo-quemado font-semibold mb-4">{error}</p> : null}
      {!form ? <p className="text-sepia/60">Cargando contenido...</p> : null}

      {form ? (
        <form id="site-content-form" onSubmit={submit} className="space-y-8">
          {editorSections.map((section) => (
            <section key={section.id} className="border border-beige-tostado/20 rounded-2xl p-5">
              <div className="mb-4">
                <h3 className="text-xl font-serif font-bold text-sepia">{section.title}</h3>
                <p className="text-sm text-sepia/60">{section.description}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <label key={`${field.section}.${field.key}`} className="block">
                    <span className="block text-sm font-semibold text-sepia mb-2">{field.label}</span>
                    {field.kind === "textarea" ? (
                      <textarea
                        value={getFieldValue(form, field)}
                        onChange={(event) => setForm((prev) => (prev ? setFieldValue(prev, field, event.target.value) : prev))}
                        className="w-full min-h-28 px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={getFieldValue(form, field)}
                        onChange={(event) => setForm((prev) => (prev ? setFieldValue(prev, field, event.target.value) : prev))}
                        className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </form>
      ) : null}

      {savedNoticeVisible ? (
        <div className="fixed right-6 top-24 z-50 max-w-sm rounded-2xl border border-olivo/20 bg-white px-4 py-3 shadow-xl">
          <div className="flex items-start gap-3">
            <CircleCheckBig size={20} className="mt-0.5 text-olivo" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sepia">Guardado listo</p>
              <p className="text-sm text-sepia/70">Los cambios del contenido ya quedaron aplicados.</p>
            </div>
            <button
              type="button"
              onClick={closeSavedNotice}
              className="text-sepia/50 transition-colors hover:text-sepia"
              aria-label="Cerrar mensaje de guardado"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-beige-tostado/30 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="min-w-0">
            {submitError ? (
              <div className="flex items-center gap-2 text-rojo-quemado">
                <CircleAlert size={18} />
                <p className="font-semibold">{submitError}</p>
              </div>
            ) : submitting ? (
              <p className="font-semibold text-sepia">Guardando contenido...</p>
            ) : isDirty ? (
              <div className="flex items-center gap-2 text-sepia">
                <CircleAlert size={18} className="text-terracota" />
                <p className="font-semibold">Hay cambios sin guardar.</p>
              </div>
            ) : (
              <p className="font-semibold text-sepia/70">Sin cambios pendientes.</p>
            )}
            <p className="mt-1 text-sm text-sepia/60">El boton de guardar queda siempre visible en esta barra.</p>
          </div>

          <button
            type="submit"
            form="site-content-form"
            disabled={!form || submitting || !isDirty}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:cursor-not-allowed disabled:bg-beige-tostado/50"
          >
            <Save size={18} />
            <span>{submitting ? "Guardando..." : "Guardar contenido"}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
