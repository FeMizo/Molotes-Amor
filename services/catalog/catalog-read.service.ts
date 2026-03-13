import { getRepositories } from "@/repositories/local-repositories";
import type { CatalogProduct } from "@/types/catalog";

import { mapProductToCatalog } from "./catalog.service";

export const listCatalogProducts = async (): Promise<CatalogProduct[]> => {
  const repos = getRepositories();
  const [products, inventory] = await Promise.all([repos.products.list(), repos.inventory.list()]);
  return products
    .map((product) =>
      mapProductToCatalog(
        product,
        inventory.find((record) => record.productId === product.id),
      ),
    )
    .filter((product) => product.available && product.inventory.stock > 0);
};
