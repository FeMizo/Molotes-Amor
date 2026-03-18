import type { FrontendSectionConfig, PageSectionKey } from "@/types/site-content";

interface FrontendSectionDefinition {
  key: PageSectionKey;
  name: string;
  description: string;
  defaultOrder: number;
  page: "home" | "menu" | "about" | "contact";
}

export const frontendSectionDefinitions: FrontendSectionDefinition[] = [
  {
    key: "home.hero",
    name: "Hero",
    description: "Encabezado principal de la portada.",
    defaultOrder: 10,
    page: "home",
  },
  {
    key: "home.featured",
    name: "Productos",
    description: "Bloque de productos destacados en inicio.",
    defaultOrder: 20,
    page: "home",
  },
  {
    key: "home.favorites",
    name: "Favoritos",
    description: "Bloque con productos favoritos del usuario.",
    defaultOrder: 30,
    page: "home",
  },
  {
    key: "home.story",
    name: "Nosotros",
    description: "Bloque editorial sobre la historia y calidad.",
    defaultOrder: 40,
    page: "home",
  },
  {
    key: "home.testimonials",
    name: "Testimonios",
    description: "Reseñas destacadas de clientes.",
    defaultOrder: 50,
    page: "home",
  },
  {
    key: "home.promotions",
    name: "Promociones",
    description: "Bloque promocional configurable.",
    defaultOrder: 60,
    page: "home",
  },
  {
    key: "menu.header",
    name: "Hero menu",
    description: "Cabecera editorial del menu.",
    defaultOrder: 10,
    page: "menu",
  },
  {
    key: "menu.products",
    name: "Productos menu",
    description: "Buscador, guardados y listado de productos.",
    defaultOrder: 20,
    page: "menu",
  },
  {
    key: "about.page",
    name: "Pagina nosotros",
    description: "Vista publica de nosotros.",
    defaultOrder: 10,
    page: "about",
  },
  {
    key: "contact.page",
    name: "Pagina contacto",
    description: "Vista publica de contacto.",
    defaultOrder: 10,
    page: "contact",
  },
];

export const defaultFrontendSections: FrontendSectionConfig[] = frontendSectionDefinitions.map(
  ({ key, name, defaultOrder }) => ({
    key,
    name,
    enabled: true,
    order: defaultOrder,
    config: {},
  }),
);

export const routeSectionMap: Record<string, PageSectionKey> = {
  "/menu": "menu.products",
  "/nosotros": "about.page",
  "/contacto": "contact.page",
};
