export type OrderStatus = "pendiente" | "confirmado" | "preparando" | "entregado" | "cancelado";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customer: CustomerInfo;
  notes?: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customer: CustomerInfo;
  notes?: string;
  items: CreateOrderItemInput[];
}
