import type { Inventory, InventoryStatus, ProductInventoryView } from "@/types/inventory";

export const resolveInventoryStatus = (inventory: Inventory): InventoryStatus => {
  if (inventory.stock <= 0 && !inventory.allowBackorder) {
    return "agotado";
  }

  if (typeof inventory.minStock === "number" && inventory.stock <= inventory.minStock) {
    return "poco-stock";
  }

  return "disponible";
};

export const toInventoryView = (inventory: Inventory): ProductInventoryView => {
  const inventoryStatus = resolveInventoryStatus(inventory);
  return {
    stock: inventory.stock,
    minStock: inventory.minStock,
    allowBackorder: inventory.allowBackorder,
    inventoryStatus,
    canPurchase: inventory.allowBackorder || inventory.stock > 0,
  };
};
