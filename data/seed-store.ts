import { INVENTORY_SEED, PRODUCT_SEED } from "@/data/products";
import type { DataStore } from "@/types/storage";

export const seedStore = (): DataStore => ({
  products: PRODUCT_SEED,
  inventory: INVENTORY_SEED,
  orders: [],
});
