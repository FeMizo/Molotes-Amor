import { getRepositories } from "@/repositories/local-repositories";
import type { CatalogProduct } from "@/types/catalog";

import { mapComboToCatalog, mapProductToCatalog } from "./catalog.service";

export const listCatalogProducts = async (): Promise<CatalogProduct[]> => {
  const repos = getRepositories();
  const [products, inventory, combos] = await Promise.all([
    repos.products.list(),
    repos.inventory.list(),
    repos.combos.list(),
  ]);
  const catalogProducts = products
    .map((product) =>
      mapProductToCatalog(
        product,
        inventory.find((record) => record.productId === product.id),
      ),
    )
    .filter((product) => product.available && product.inventory.stock > 0);
  const catalogCombos = combos
    .map((combo) => mapComboToCatalog(combo, products, inventory))
    .filter((combo) => combo.comboItems && combo.comboItems.length > 0);

  return [...catalogCombos, ...catalogProducts];
};
