export type ProductBadge = "Popular" | "Nuevo" | "Más pedido";

export interface Product {
  id: string;
  slug: string;
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
  badge?: ProductBadge;
}
