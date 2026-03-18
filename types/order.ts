export type OrderStatus =
  | "pendiente"
  | "confirmado"
  | "preparando"
  | "en-camino"
  | "entregado"
  | "cancelado";

export type OrderPaymentMethod = "efectivo" | "transferencia";

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
  email?: string;
  address?: string;
}

export interface OrderPayment {
  method: OrderPaymentMethod;
  transferReference?: string;
  bank?: string;
  accountHolder?: string;
  accountNumber?: string;
  clabe?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userId?: string;
  userUsername?: string;
  customer: CustomerInfo;
  payment?: OrderPayment;
  notes?: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  account: {
    userId: string;
    username: string;
  };
  customer: CustomerInfo & {
    email: string;
  };
  payment?: {
    method: OrderPaymentMethod;
  };
  notes?: string;
  items: CreateOrderItemInput[];
}
