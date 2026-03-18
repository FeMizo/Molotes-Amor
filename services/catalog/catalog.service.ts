import { toSlug } from "@/lib/slug";
import { toInventoryView } from "@/lib/inventory";
import type { Combo } from "@/types/combo";
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
    kind: "product",
    available: product.available && inventoryView.canPurchase,
    inventory: inventoryView,
  };
};

export const mapComboToCatalog = (
  combo: Combo,
  products: Product[],
  inventory: Inventory[],
): CatalogProduct => {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const inventoryMap = new Map(inventory.map((record) => [record.productId, record]));
  const resolvedItems = combo.items
    .map((item) => ({
      item,
      product: productMap.get(item.productId),
      inventory: inventoryMap.get(item.productId),
    }))
    .filter(
      (entry): entry is {
        item: Combo["items"][number];
        product: Product;
        inventory: Inventory;
      } => Boolean(entry.product && entry.inventory),
    );

  const stockCandidates = resolvedItems.map(({ item, inventory: record }) =>
    record.allowBackorder
      ? Number.MAX_SAFE_INTEGER
      : Math.floor(record.stock / Math.max(1, item.quantity)),
  );
  const minStockCandidates = resolvedItems
    .map(({ item, inventory: record }) =>
      typeof record.minStock === "number"
        ? Math.floor(record.minStock / Math.max(1, item.quantity))
        : undefined,
    )
    .filter((value): value is number => value !== undefined);
  const derivedStock =
    stockCandidates.length > 0 ? Math.max(0, Math.min(...stockCandidates)) : 0;
  const derivedInventory: Inventory = {
    productId: combo.id,
    stock:
      derivedStock === Number.MAX_SAFE_INTEGER ? 999 : derivedStock,
    minStock:
      minStockCandidates.length > 0 ? Math.min(...minStockCandidates) : undefined,
    allowBackorder:
      resolvedItems.length > 0 &&
      resolvedItems.every(({ inventory: record }) => record.allowBackorder),
  };
  const inventoryView = toInventoryView(derivedInventory);
  const imageFallback = resolvedItems.find(({ product }) => product.image)?.product.image ?? "";
  const comboLines = resolvedItems.map(
    ({ item, product }) => `${item.quantity}x ${product.name}`,
  );

  return {
    id: combo.id,
    slug: toSlug(combo.name),
    name: combo.name,
    description:
      combo.description?.trim() ||
      `Incluye ${comboLines.join(", ")}.`,
    longDescription:
      combo.description?.trim() ||
      `Combo armado con ${comboLines.join(", ")} para pedirlo en un solo paso.`,
    price: combo.finalPrice,
    previousPrice:
      combo.regularPrice > combo.finalPrice ? combo.regularPrice : undefined,
    category: combo.category ?? "Combos",
    image: combo.image ?? imageFallback,
    featured: combo.featured,
    available:
      combo.active &&
      resolvedItems.length === combo.items.length &&
      resolvedItems.every(
        ({ product, inventory: record }) => product.available && (record.allowBackorder || record.stock > 0),
      ) &&
      inventoryView.canPurchase,
    tags: [
      "combo",
      combo.category ?? "combos",
      ...resolvedItems.map(({ product }) => product.name),
      ...resolvedItems.flatMap(({ product }) => product.tags),
    ],
    badge: combo.featured ? "Popular" : undefined,
    kind: "combo",
    inventory: inventoryView,
    comboItems: combo.items,
    comboRegularPrice: combo.regularPrice,
  };
};
