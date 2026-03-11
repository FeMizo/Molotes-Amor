import { getRepositories } from "@/repositories/local-repositories";
import { toSlug } from "@/lib/slug";
import type { Inventory } from "@/types/inventory";
import type { Product } from "@/types/product";

export interface ProductCreateInput {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  category: string;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[];
  badge?: Product["badge"];
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

export const listProductsWithInventory = async () => {
  const repos = getRepositories();
  const [products, inventory] = await Promise.all([repos.products.list(), repos.inventory.list()]);
  return products.map((product) => ({
    ...product,
    inventory: inventory.find((record) => record.productId === product.id) ?? {
      productId: product.id,
      stock: 0,
      minStock: 0,
      allowBackorder: false,
    },
  }));
};

export const createProductWithInventory = async (input: ProductCreateInput) => {
  const repos = getRepositories();
  const productId = `prd-${Date.now()}`;

  const product: Product = {
    id: productId,
    slug: toSlug(input.name),
    name: input.name,
    description: input.description,
    longDescription: input.longDescription,
    price: input.price,
    previousPrice: input.previousPrice,
    category: input.category,
    image: input.image,
    featured: input.featured,
    available: input.available,
    tags: input.tags,
    badge: input.badge,
  };

  const inventory: Inventory = {
    productId,
    stock: input.stock,
    minStock: input.minStock,
    allowBackorder: input.allowBackorder,
  };

  await repos.products.create(product);
  await repos.inventory.upsert(inventory);

  return { ...product, inventory };
};

export const updateProductWithInventory = async (id: string, input: ProductUpdateInput) => {
  const repos = getRepositories();
  const current = await repos.products.findById(id);

  if (!current) {
    throw new Error("Producto no encontrado");
  }

  const patch: Partial<Product> = {
    ...input,
    slug: input.name ? toSlug(input.name) : current.slug,
    tags: input.tags ?? current.tags,
  };

  const updated = await repos.products.update(id, patch);
  const currentInventory = await repos.inventory.findByProductId(id);

  if (input.stock !== undefined || input.minStock !== undefined || input.allowBackorder !== undefined) {
    await repos.inventory.upsert({
      productId: id,
      stock: input.stock ?? currentInventory?.stock ?? 0,
      minStock: input.minStock ?? currentInventory?.minStock,
      allowBackorder: input.allowBackorder ?? currentInventory?.allowBackorder ?? false,
    });
  }

  const inventory = await repos.inventory.findByProductId(id);
  return { ...updated, inventory };
};

export const deleteProductWithInventory = async (id: string) => {
  const repos = getRepositories();
  await repos.products.remove(id);
};
