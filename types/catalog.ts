import type { ComboItem } from "@/types/combo";
import type { Product } from "@/types/product";
import type { ProductInventoryView } from "@/types/inventory";

export interface CatalogProduct extends Product {
  kind: "product" | "combo";
  inventory: ProductInventoryView;
  comboItems?: ComboItem[];
  comboRegularPrice?: number;
}
