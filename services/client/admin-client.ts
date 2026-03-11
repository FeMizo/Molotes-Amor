import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";

import { httpRequest } from "./http";

export interface ProductWithInventoryResponse {
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
  badge?: "Popular" | "Nuevo" | "Mas pedido";
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
  category: string;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[];
  badge?: "Popular" | "Nuevo" | "Mas pedido";
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

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
};
