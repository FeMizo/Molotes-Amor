import type { ProductCategory } from "@/types/product";

export const COMBO_CATEGORIES = [
  "Combos",
  "Con bebida",
  "Familiares",
  "Temporada",
] as const;

export type ComboCategory = (typeof COMBO_CATEGORIES)[number] | (string & {});

export interface ComboItem {
  productId: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  description?: string;
  image?: string;
  items: ComboItem[];
  regularPrice: number;
  finalPrice: number;
  active: boolean;
  featured: boolean;
  order: number;
  category?: ComboCategory | ProductCategory;
}
