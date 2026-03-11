import type { CatalogProduct } from "@/types/catalog";

import { httpRequest } from "./http";

export const catalogClient = {
  listProducts: () => httpRequest<CatalogProduct[]>("/api/catalog/products"),
};
