import { getRepositories } from "@/repositories/local-repositories";
import { resolveInventoryStatus } from "@/lib/inventory";

export const listInventoryRows = async () => {
  const repos = getRepositories();
  const [products, inventory] = await Promise.all([repos.products.list(), repos.inventory.list()]);

  return products.map((product) => {
    const record = inventory.find((item) => item.productId === product.id) ?? {
      productId: product.id,
      stock: 0,
      minStock: 0,
      allowBackorder: false,
    };
    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      stock: record.stock,
      minStock: record.minStock,
      allowBackorder: record.allowBackorder,
      status: resolveInventoryStatus(record),
      available: product.available,
    };
  });
};

export interface InventoryUpdateInput {
  productId: string;
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
  available?: boolean;
}

export const updateInventoryRow = async (input: InventoryUpdateInput) => {
  const repos = getRepositories();
  await repos.inventory.upsert({
    productId: input.productId,
    stock: input.stock,
    minStock: input.minStock,
    allowBackorder: input.allowBackorder,
  });

  if (typeof input.available === "boolean") {
    await repos.products.update(input.productId, { available: input.available });
  }

  return listInventoryRows();
};
