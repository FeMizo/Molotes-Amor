import { getRepositories } from "@/repositories/local-repositories";
import type { Combo, ComboItem } from "@/types/combo";
import type { Product } from "@/types/product";

export interface ComboCreateInput {
  name: string;
  description?: string;
  image?: string;
  items: ComboItem[];
  finalPrice: number;
  active: boolean;
  featured: boolean;
  order?: number;
  category?: Combo["category"];
}

export interface ComboUpdateInput extends Partial<ComboCreateInput> {}

const toComboId = (): string => `cmb-${Date.now()}`;

const normalizeComboItems = (items: ComboItem[]): ComboItem[] => {
  const itemsByProduct = new Map<string, number>();

  for (const item of items) {
    const productId = item.productId.trim();
    const quantity = Math.max(0, Number(item.quantity));

    if (!productId || quantity <= 0) {
      continue;
    }

    itemsByProduct.set(productId, (itemsByProduct.get(productId) ?? 0) + quantity);
  }

  return [...itemsByProduct.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

const calculateRegularPrice = (items: ComboItem[], products: Product[]): number => {
  const productMap = new Map(products.map((product) => [product.id, product]));

  return items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("Uno de los productos del combo ya no existe.");
    }

    return sum + product.price * item.quantity;
  }, 0);
};

const assertValidComboInput = (
  input: Pick<ComboCreateInput, "name" | "items" | "finalPrice">,
): void => {
  if (input.name.trim().length < 3) {
    throw new Error("El combo necesita un nombre mas claro.");
  }

  if (input.items.length === 0) {
    throw new Error("Agrega al menos un producto al combo.");
  }

  if (Number.isNaN(Number(input.finalPrice)) || Number(input.finalPrice) <= 0) {
    throw new Error("Ingresa un precio final valido para el combo.");
  }
};

export const listCombos = async (): Promise<Combo[]> => {
  const repos = getRepositories();
  return repos.combos.list();
};

export const createCombo = async (input: ComboCreateInput): Promise<Combo> => {
  const repos = getRepositories();
  const products = await repos.products.list();
  const items = normalizeComboItems(input.items);

  assertValidComboInput({
    name: input.name,
    items,
    finalPrice: input.finalPrice,
  });

  const combo: Combo = {
    id: toComboId(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    image: input.image?.trim() || undefined,
    items,
    regularPrice: calculateRegularPrice(items, products),
    finalPrice: Number(input.finalPrice),
    active: input.active,
    featured: input.featured,
    order: input.order ?? 0,
    category: input.category?.trim() || undefined,
  };

  return repos.combos.create(combo);
};

export const updateCombo = async (id: string, input: ComboUpdateInput): Promise<Combo> => {
  const repos = getRepositories();
  const current = await repos.combos.findById(id);

  if (!current) {
    throw new Error("Combo no encontrado");
  }

  const products = await repos.products.list();
  const items = input.items ? normalizeComboItems(input.items) : current.items;
  const nextName = input.name?.trim() ?? current.name;
  const nextFinalPrice = input.finalPrice ?? current.finalPrice;

  assertValidComboInput({
    name: nextName,
    items,
    finalPrice: nextFinalPrice,
  });

  return repos.combos.update(id, {
    ...input,
    name: nextName,
    description:
      input.description !== undefined ? input.description.trim() || undefined : current.description,
    image: input.image !== undefined ? input.image.trim() || undefined : current.image,
    items,
    regularPrice: calculateRegularPrice(items, products),
    finalPrice: Number(nextFinalPrice),
    category: input.category !== undefined ? input.category.trim() || undefined : current.category,
  });
};

export const deleteCombo = async (id: string): Promise<void> => {
  const repos = getRepositories();
  const current = await repos.combos.findById(id);

  if (!current) {
    throw new Error("Combo no encontrado");
  }

  await repos.combos.remove(id);
};
