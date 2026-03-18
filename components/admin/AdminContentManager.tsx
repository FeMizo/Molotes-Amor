"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheckBig, Save, X } from "lucide-react";

import {
  adminContentFieldRegistry,
  adminContentSections,
} from "@/config/admin-content-sections";
import { frontendSectionDefinitions } from "@/config/site-sections";
import { useAdminSiteContent } from "@/hooks/use-admin-site-content";
import type {
  AdminContentSectionId,
  FrontendSectionConfig,
  SiteContent,
} from "@/types/site-content";

const getFieldValue = (
  content: SiteContent,
  path: [Exclude<keyof SiteContent, "pageSections">, string],
) => {
  const [root, key] = path;
  const target = content[root] as unknown as Record<string, string | boolean>;
  return target[key];
};

const setFieldValue = (
  content: SiteContent,
  path: [Exclude<keyof SiteContent, "pageSections">, string],
  value: string | boolean,
): SiteContent => {
  const [root, key] = path;
  const target = content[root] as unknown as Record<string, string | boolean>;

  return {
    ...content,
    [root]: {
      ...target,
      [key]: value,
    },
  } as SiteContent;
};

const updatePageSection = (
  content: SiteContent,
  sectionKey: FrontendSectionConfig["key"],
  patch: Partial<FrontendSectionConfig>,
): SiteContent => ({
  ...content,
  pageSections: content.pageSections.map((section) =>
    section.key === sectionKey ? { ...section, ...patch } : section,
  ),
});

export const AdminContentManager = () => {
  const { content, loading, error, updateContent } = useAdminSiteContent();
  const [form, setForm] = useState<SiteContent | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSection, setSelectedSection] = useState<AdminContentSectionId>("sections");
  const savedNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSection = useMemo(
    () => adminContentSections.find((section) => section.id === selectedSection) ?? adminContentSections[0],
    [selectedSection],
  );
  const sectionConfig = form?.pageSections.find(
    (section) => section.key === currentSection.sectionKey,
  );
  const sectionFields =
    currentSection.id === "sections"
      ? []
      : adminContentFieldRegistry[currentSection.id] ?? [];

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
    <article className="relative rounded-[2rem] border border-beige-tostado/30 bg-white p-6 pb-32 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-sepia">Contenido del sitio</h2>
          <p className="mt-1 text-sepia/70">
            Administra secciones, textos y bloques con paneles dinamicos segun el bloque seleccionado.
          </p>
        </div>
        <span className="text-sm font-semibold text-sepia/60">{loading ? "Cargando..." : "Listo para editar"}</span>
      </div>

      {error ? <p className="mt-4 font-semibold text-rojo-quemado">{error}</p> : null}
      {!form ? <p className="mt-6 text-sepia/60">Cargando contenido...</p> : null}

      {form ? (
        <form id="site-content-form" onSubmit={submit} className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[1.5rem] border border-beige-tostado/20 bg-crema p-3">
            <nav className="space-y-2">
              {adminContentSections.map((section) => {
                const active = selectedSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                      active
                        ? "border-terracota/35 bg-terracota/10 shadow-sm"
                        : "border-transparent hover:-translate-y-0.5 hover:border-beige-tostado/30 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <span className="block font-semibold text-sepia">{section.name}</span>
                    <span className="mt-1 block text-sm text-sepia/60">{section.description}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="space-y-5">
            <div className="rounded-[1.5rem] border border-beige-tostado/20 p-5">
              <h3 className="text-2xl font-serif font-bold text-sepia">{currentSection.name}</h3>
              <p className="mt-2 text-sepia/65">{currentSection.description}</p>
            </div>

            {currentSection.id === "sections" ? (
              <div className="grid gap-4">
                {frontendSectionDefinitions.map((definition) => {
                  const current = form.pageSections.find((section) => section.key === definition.key);
                  if (!current) {
                    return null;
                  }

                  return (
                    <article
                      key={definition.key}
                      className="rounded-[1.5rem] border border-beige-tostado/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracota/20 hover:bg-crema/35 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-serif font-bold text-sepia">{current.name}</h4>
                          <p className="mt-1 text-sm text-sepia/60">{definition.description}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[auto_120px]">
                          <label className="inline-flex items-center gap-2 rounded-xl bg-crema px-4 py-3 text-sm font-semibold text-sepia">
                            <input
                              type="checkbox"
                              checked={current.enabled}
                              onChange={(event) =>
                                setForm((prev) =>
                                  prev ? updatePageSection(prev, current.key, { enabled: event.target.checked }) : prev,
                                )
                              }
                            />
                            Habilitada
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-sepia">Orden</span>
                            <input
                              type="number"
                              value={current.order}
                              onChange={(event) =>
                                setForm((prev) =>
                                  prev
                                    ? updatePageSection(prev, current.key, {
                                        order: Number(event.target.value) || 0,
                                      })
                                    : prev,
                                )
                              }
                              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                            />
                          </label>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <>
                {sectionConfig ? (
                  <article className="rounded-[1.5rem] border border-beige-tostado/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracota/20 hover:bg-crema/35 hover:shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-sepia">Configuracion de seccion</h4>
                        <p className="mt-1 text-sm text-sepia/60">
                          Controla visibilidad y prioridad de render del frontend desde este mismo panel.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[auto_110px]">
                        <label className="inline-flex items-center gap-2 rounded-xl bg-crema px-4 py-3 text-sm font-semibold text-sepia">
                          <input
                            type="checkbox"
                            checked={sectionConfig.enabled}
                            onChange={(event) =>
                              setForm((prev) =>
                                prev
                                  ? updatePageSection(prev, sectionConfig.key, {
                                      enabled: event.target.checked,
                                    })
                                  : prev,
                              )
                            }
                          />
                          Visible
                        </label>
                        <input
                          type="number"
                          value={sectionConfig.order}
                          onChange={(event) =>
                            setForm((prev) =>
                              prev
                                ? updatePageSection(prev, sectionConfig.key, {
                                    order: Number(event.target.value) || 0,
                                  })
                                : prev,
                            )
                          }
                          className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                        />
                      </div>
                    </div>
                  </article>
                ) : null}

                <article className="rounded-[1.5rem] border border-beige-tostado/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracota/20 hover:bg-crema/35 hover:shadow-sm">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {sectionFields.map((field) => (
                      <label key={`${field.path[0]}.${field.path[1]}`} className="block">
                        <span className="mb-2 block text-sm font-semibold text-sepia">{field.label}</span>
                        {field.kind === "textarea" ? (
                          <textarea
                            value={String(getFieldValue(form, field.path) ?? "")}
                            onChange={(event) =>
                              setForm((prev) =>
                                prev ? setFieldValue(prev, field.path, event.target.value) : prev,
                              )
                            }
                            className="min-h-28 w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                          />
                        ) : field.kind === "switch" ? (
                          <label className="inline-flex w-full items-center gap-3 rounded-xl bg-crema px-4 py-3 font-semibold text-sepia">
                            <input
                              type="checkbox"
                              checked={Boolean(getFieldValue(form, field.path))}
                              onChange={(event) =>
                                setForm((prev) =>
                                  prev ? setFieldValue(prev, field.path, event.target.checked) : prev,
                                )
                              }
                            />
                            {Boolean(getFieldValue(form, field.path)) ? "Activo" : "Inactivo"}
                          </label>
                        ) : (
                          <input
                            type="text"
                            value={String(getFieldValue(form, field.path) ?? "")}
                            onChange={(event) =>
                              setForm((prev) =>
                                prev ? setFieldValue(prev, field.path, event.target.value) : prev,
                              )
                            }
                            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </article>
              </>
            )}
          </section>
        </form>
      ) : null}

      {savedNoticeVisible ? (
        <div className="fixed right-6 top-24 z-50 max-w-sm rounded-2xl border border-olivo/20 bg-white px-4 py-3 shadow-xl">
          <div className="flex items-start gap-3">
            <CircleCheckBig size={20} className="mt-0.5 text-olivo" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sepia">Guardado listo</p>
              <p className="text-sm text-sepia/70">Los cambios ya quedaron aplicados.</p>
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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-beige-tostado/30 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md">
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
            <p className="mt-1 text-sm text-sepia/60">La barra de guardado queda visible mientras editas.</p>
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
