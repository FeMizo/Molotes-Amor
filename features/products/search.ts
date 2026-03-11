import type { Product } from "@/types/product";

export interface ProductFilters {
  query: string;
  category: string;
}

const normalize = (value: string): string => value.trim().toLowerCase();

export const filterProducts = <T extends Product>(products: T[], filters: ProductFilters): T[] => {
  const query = normalize(filters.query);
  const category = filters.category;

  return products.filter((product) => {
    const matchesCategory = category === "Todos" || product.category === category;
    const matchesQuery =
      !query ||
      normalize(product.name).includes(query) ||
      normalize(product.description).includes(query) ||
      normalize(product.category).includes(query) ||
      product.tags.some((tag) => normalize(tag).includes(query));

    return matchesCategory && matchesQuery;
  });
};

export const featuredProducts = <T extends Product>(products: T[]): T[] =>
  products.filter((product) => product.featured).slice(0, 3);
