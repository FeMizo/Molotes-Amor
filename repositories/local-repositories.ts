import type { Inventory } from "@/types/inventory";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { SiteContent } from "@/types/site-content";
import type {
  InventoryRepository,
  OrderRepository,
  ProductRepository,
  SiteContentRepository,
} from "@/types/storage";

import { postgresRepositories } from "./postgres-repositories";
import { readStore, writeStore } from "./file-store";

const toProductRecord = (
  current: Product,
  patch: Partial<Product>,
): Product => ({
  id: current.id,
  slug: patch.slug ?? current.slug,
  name: patch.name ?? current.name,
  description: patch.description ?? current.description,
  longDescription: patch.longDescription ?? current.longDescription,
  price: patch.price ?? current.price,
  previousPrice:
    "previousPrice" in patch ? patch.previousPrice : current.previousPrice,
  category: patch.category ?? current.category,
  image: patch.image ?? current.image,
  featured: patch.featured ?? current.featured,
  available: patch.available ?? current.available,
  tags: patch.tags ?? current.tags,
  badge: "badge" in patch ? patch.badge : current.badge,
});

export const localProductRepository: ProductRepository = {
  async list() {
    const store = await readStore();
    return store.products;
  },
  async findById(id) {
    const store = await readStore();
    return store.products.find((product) => product.id === id);
  },
  async create(input) {
    const store = await readStore();
    store.products.push(input);
    await writeStore(store);
    return input;
  },
  async update(id, patch) {
    const store = await readStore();
    const idx = store.products.findIndex((product) => product.id === id);
    if (idx < 0) {
      throw new Error("Producto no encontrado");
    }
    const updated = toProductRecord(store.products[idx], patch);
    store.products[idx] = updated;
    await writeStore(store);
    return updated;
  },
  async remove(id) {
    const store = await readStore();
    store.products = store.products.filter((product) => product.id !== id);
    store.inventory = store.inventory.filter(
      (inventory) => inventory.productId !== id,
    );
    await writeStore(store);
  },
};

export const localInventoryRepository: InventoryRepository = {
  async list() {
    const store = await readStore();
    return store.inventory;
  },
  async findByProductId(productId) {
    const store = await readStore();
    return store.inventory.find((record) => record.productId === productId);
  },
  async upsert(record) {
    const store = await readStore();
    const idx = store.inventory.findIndex(
      (item) => item.productId === record.productId,
    );
    if (idx < 0) {
      store.inventory.push(record);
    } else {
      store.inventory[idx] = record;
    }
    await writeStore(store);
    return record;
  },
  async adjustStock(productId, delta) {
    const store = await readStore();
    const idx = store.inventory.findIndex(
      (item) => item.productId === productId,
    );
    if (idx < 0) {
      throw new Error("Inventario no encontrado");
    }
    const record = store.inventory[idx];
    const nextStock = Math.max(0, record.stock + delta);
    const updated = { ...record, stock: nextStock } satisfies Inventory;
    store.inventory[idx] = updated;
    await writeStore(store);
    return updated;
  },
};

export const localOrderRepository: OrderRepository = {
  async list() {
    const store = await readStore();
    return [...store.orders].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },
  async findById(id) {
    const store = await readStore();
    return store.orders.find((order) => order.id === id);
  },
  async create(order) {
    const store = await readStore();
    store.orders.push(order);
    await writeStore(store);
    return order;
  },
  async updateStatus(id, status) {
    const store = await readStore();
    const idx = store.orders.findIndex((order) => order.id === id);
    if (idx < 0) {
      throw new Error("Pedido no encontrado");
    }
    const updated = { ...store.orders[idx], status } satisfies Order;
    store.orders[idx] = updated;
    await writeStore(store);
    return updated;
  },
};

export const localSiteContentRepository: SiteContentRepository = {
  async get() {
    const store = await readStore();
    return store.siteContent;
  },
  async update(content) {
    const store = await readStore();
    store.siteContent = content satisfies SiteContent;
    await writeStore(store);
    return store.siteContent;
  },
};

export interface Repositories {
  products: ProductRepository;
  inventory: InventoryRepository;
  orders: OrderRepository;
  siteContent: SiteContentRepository;
}

export const localRepositories: Repositories = {
  products: localProductRepository,
  inventory: localInventoryRepository,
  orders: localOrderRepository,
  siteContent: localSiteContentRepository,
};

export const databaseRepositories: Repositories = postgresRepositories;

const notImplemented = () => {
  throw new Error(
    "Adapter remoto no implementado: conecta tu API externa en repositories/remote-repositories.ts",
  );
};

const remoteStub: Repositories = {
  products: {
    list: notImplemented,
    findById: notImplemented,
    create: notImplemented,
    update: notImplemented,
    remove: notImplemented,
  },
  inventory: {
    list: notImplemented,
    findByProductId: notImplemented,
    upsert: notImplemented,
    adjustStock: notImplemented,
  },
  orders: {
    list: notImplemented,
    findById: notImplemented,
    create: notImplemented,
    updateStatus: notImplemented,
  },
  siteContent: {
    get: notImplemented,
    update: notImplemented,
  },
};

export const getRepositories = (): Repositories => {
  const mode =
    process.env.DATA_ADAPTER_MODE ??
    (process.env.molotes_DATABASE_URL ? "database" : "local-file");
  if (mode === "database") {
    return databaseRepositories;
  }
  if (mode === "remote-api") {
    return remoteStub;
  }
  return localRepositories;
};

export const isLocalFileMode = (): boolean =>
  (process.env.DATA_ADAPTER_MODE ??
    (process.env.molotes_DATABASE_URL ? "database" : "local-file")) ===
  "local-file";
