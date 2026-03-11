import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "molote-tinga",
    name: "Molote de Tinga",
    description: "Pollo deshebrado con un toque de chipotle y cebolla caramelizada.",
    longDescription:
      "Un clásico de la casa preparado con pollo cocido lentamente, chipotle y cebolla caramelizada.",
    price: 45,
    category: "Tradicionales",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Más pedido",
    featured: true,
    available: true,
    tags: ["pollo", "chipotle", "tradicional"],
  },
  {
    id: "2",
    slug: "molote-papa-chorizo",
    name: "Molote de Papa con Chorizo",
    description: "La combinación clásica de papa suave y chorizo artesanal crujiente.",
    longDescription:
      "Relleno abundante con papa sazonada y chorizo artesanal dorado al momento.",
    price: 42,
    category: "Tradicionales",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    featured: true,
    available: true,
    tags: ["papa", "chorizo", "clásico"],
  },
  {
    id: "3",
    slug: "molote-queso-oaxaca",
    name: "Molote de Queso Oaxaca",
    description: "Queso de hebra derretido con epazote fresco.",
    longDescription:
      "Queso oaxaca fundido y epazote fresco para un balance suave y aromático.",
    price: 40,
    category: "Quesos",
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=800&q=80",
    featured: false,
    available: true,
    tags: ["queso", "oaxaca", "suave"],
  },
  {
    id: "4",
    slug: "molote-champinones",
    name: "Molote de Champiñones",
    description: "Champiñones salteados con ajo y un toque de chile serrano.",
    longDescription:
      "Receta vegetariana con champiñones frescos, ajo y chile serrano en su punto.",
    price: 42,
    category: "Vegetarianos",
    image: "https://images.unsplash.com/photo-1541518763669-279f00ed02ae?auto=format&fit=crop&w=800&q=80",
    badge: "Nuevo",
    featured: false,
    available: true,
    tags: ["vegetariano", "champiñones", "ajo"],
  },
  {
    id: "5",
    slug: "molote-requeson",
    name: "Molote de Requesón",
    description: "Requesón fresco con rajas de chile poblano.",
    longDescription:
      "Relleno cremoso de requesón con rajas de chile poblano y sazón casera.",
    price: 40,
    category: "Quesos",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    featured: false,
    available: true,
    tags: ["requesón", "queso", "poblano"],
  },
  {
    id: "6",
    slug: "molote-huitlacoche",
    name: "Molote de Huitlacoche",
    description: "El manjar mexicano con cebolla y epazote.",
    longDescription:
      "Huitlacoche seleccionado, cebolla y epazote con toque artesanal poblano.",
    price: 55,
    category: "Especialidades",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    featured: true,
    available: true,
    tags: ["especialidad", "huitlacoche", "epazote"],
  },
];

export const CATEGORIES = ["Todos", "Tradicionales", "Quesos", "Vegetarianos", "Especialidades"];
