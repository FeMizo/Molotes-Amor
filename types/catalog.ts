import type { Product } from "@/types/product";
import type { ProductInventoryView } from "@/types/inventory";

export interface CatalogProduct extends Product {
  inventory: ProductInventoryView;
}
