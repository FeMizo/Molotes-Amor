import type { ComboCategory, ComboItem } from "@/types/combo";
import type { Product, ProductCategory } from "@/types/product";

export interface ProductAdminFormState {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  previousPrice: string;
  category: ProductCategory;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string;
  badge: Product["badge"] | "";
  stock: string;
  minStock: string;
  allowBackorder: boolean;
}

export interface ComboAdminFormState {
  name: string;
  description: string;
  image: string;
  finalPrice: string;
  active: boolean;
  featured: boolean;
  order: string;
  category: ComboCategory;
  items: ComboItem[];
}

export interface InventoryQuickEditState {
  productId: string;
  stock: string;
  minStock: string;
  allowBackorder: boolean;
}
