export type InventoryStatus = "disponible" | "poco-stock" | "agotado";

export interface Inventory {
  productId: string;
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
}

export interface ProductInventoryView {
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
  inventoryStatus: InventoryStatus;
  canPurchase: boolean;
}
