import { promises as fs } from "node:fs";
import path from "node:path";

import { normalizeSiteContent } from "@/data/site-content";
import { seedStore } from "@/data/seed-store";
import type { DataStore } from "@/types/storage";

const DB_PATH = path.join(process.cwd(), "storage", "db.json");

const ensureDbFile = async (): Promise<void> => {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initial = seedStore();
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
};

export const readStore = async (): Promise<DataStore> => {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<DataStore>;
  const seed = seedStore();
  const productMap = new Map(seed.products.map((product) => [product.id, product]));
  const inventoryMap = new Map(seed.inventory.map((record) => [record.productId, record]));

  for (const product of parsed.products ?? []) {
    productMap.set(product.id, product);
  }

  for (const record of parsed.inventory ?? []) {
    inventoryMap.set(record.productId, record);
  }

  return {
    products: [...productMap.values()],
    inventory: [...inventoryMap.values()],
    combos: parsed.combos ?? seed.combos,
    orders: parsed.orders ?? seed.orders,
    siteContent: normalizeSiteContent(parsed.siteContent),
  };
};

export const writeStore = async (store: DataStore): Promise<void> => {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(store, null, 2), "utf8");
};
