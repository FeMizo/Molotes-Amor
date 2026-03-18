export const PRODUCT_CATEGORIES = [
  "Tradicionales",
  "Quesos",
  "Vegetarianos",
  "Especialidades",
  "Bebidas",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number] | (string & {});
export type ProductBadge = "Popular" | "Nuevo" | "Mas pedido";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  category: ProductCategory;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[];
  badge?: ProductBadge;
}
