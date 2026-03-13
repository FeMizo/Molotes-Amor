import { seedUserOrders } from "@/data/account";
import { INVENTORY_SEED, PRODUCT_SEED } from "@/data/products";
import { defaultSiteContent } from "@/data/site-content";
import type { DataStore } from "@/types/storage";

export const seedStore = (): DataStore => ({
  products: PRODUCT_SEED,
  inventory: INVENTORY_SEED,
  orders: seedUserOrders,
  siteContent: defaultSiteContent,
});
