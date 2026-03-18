import type { Combo } from "@/types/combo";
import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";
import type { ProductBadge, ProductCategory } from "@/types/product";
import type { SiteContent } from "@/types/site-content";

import { httpRequest } from "./http";

export interface ProductWithInventoryResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  category: ProductCategory;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[];
  badge?: ProductBadge;
  inventory: {
    productId: string;
    stock: number;
    minStock?: number;
    allowBackorder: boolean;
  };
}

export interface InventoryRow {
  productId: string;
  productName: string;
  category: string;
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
  status: "disponible" | "poco-stock" | "agotado";
  available: boolean;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  category: ProductCategory;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[];
  badge?: ProductBadge;
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
export type CreateComboPayload = Omit<Combo, "id" | "regularPrice">;
export type UpdateComboPayload = Partial<CreateComboPayload> & {
  regularPrice?: number;
};

export const adminClient = {
  listProducts: () => httpRequest<ProductWithInventoryResponse[]>("/api/admin/products"),
  createProduct: (payload: CreateProductPayload) =>
    httpRequest<ProductWithInventoryResponse>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    httpRequest<ProductWithInventoryResponse>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id: string) =>
    httpRequest<{ ok: true }>(`/api/admin/products/${id}`, {
      method: "DELETE",
    }),
  listCombos: () => httpRequest<Combo[]>("/api/admin/combos"),
  createCombo: (payload: CreateComboPayload) =>
    httpRequest<Combo>("/api/admin/combos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateCombo: (id: string, payload: UpdateComboPayload) =>
    httpRequest<Combo>(`/api/admin/combos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteCombo: (id: string) =>
    httpRequest<{ ok: true }>(`/api/admin/combos/${id}`, {
      method: "DELETE",
    }),
  listInventory: () => httpRequest<InventoryRow[]>("/api/admin/inventory"),
  updateInventory: (payload: {
    productId: string;
    stock: number;
    minStock?: number;
    allowBackorder: boolean;
    available?: boolean;
  }) =>
    httpRequest<InventoryRow[]>("/api/admin/inventory", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  listOrders: () => httpRequest<Order[]>("/api/admin/orders"),
  getOrder: (id: string) => httpRequest<Order>(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    httpRequest<Order>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  createOrder: (payload: CreateOrderInput) =>
    httpRequest<Order>("/api/admin/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getSiteContent: () => httpRequest<SiteContent>("/api/admin/content"),
  updateSiteContent: (payload: SiteContent) =>
    httpRequest<SiteContent>("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
