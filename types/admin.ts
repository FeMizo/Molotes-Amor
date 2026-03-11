import type { Product } from "@/types/product";

export interface ProductAdminFormState {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  previousPrice: string;
  category: string;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string;
  badge: Product["badge"] | "";
  stock: string;
  minStock: string;
  allowBackorder: boolean;
}

export interface InventoryQuickEditState {
  productId: string;
  stock: string;
  minStock: string;
  allowBackorder: boolean;
}
