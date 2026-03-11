import { toInventoryView } from "@/lib/inventory";
import type { CatalogProduct } from "@/types/catalog";
import type { Inventory } from "@/types/inventory";
import type { Product } from "@/types/product";

export const mapProductToCatalog = (product: Product, inventory?: Inventory): CatalogProduct => {
  const fallback: Inventory = {
    productId: product.id,
    stock: 0,
    minStock: 0,
    allowBackorder: false,
  };

  const inventoryData = inventory ?? fallback;
  const inventoryView = toInventoryView(inventoryData);

  return {
    ...product,
    available: product.available && inventoryView.canPurchase,
    inventory: inventoryView,
  };
};
