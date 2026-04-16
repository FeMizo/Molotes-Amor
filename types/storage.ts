import type { Combo } from "@/types/combo";
import type { Inventory } from "@/types/inventory";
import type {
  Order,
  OrderInventoryAdjustment,
  OrderItem,
  OrderStatus,
} from "@/types/order";
import type { Product } from "@/types/product";
import type { SiteContent, SiteContentRepository } from "@/types/site-content";

export interface DataStore {
  products: Product[];
  inventory: Inventory[];
  combos: Combo[];
  orders: Order[];
  siteContent: SiteContent;
}

export interface ProductRepository {
  list(): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  create(input: Product): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
}

export interface InventoryRepository {
  list(): Promise<Inventory[]>;
  findByProductId(productId: string): Promise<Inventory | undefined>;
  upsert(record: Inventory): Promise<Inventory>;
  adjustStock(productId: string, delta: number): Promise<Inventory>;
}

export interface ComboRepository {
  list(): Promise<Combo[]>;
  findById(id: string): Promise<Combo | undefined>;
  create(input: Combo): Promise<Combo>;
  update(id: string, patch: Partial<Combo>): Promise<Combo>;
  remove(id: string): Promise<void>;
}

export interface OrderRepository {
  list(): Promise<Order[]>;
  findById(id: string): Promise<Order | undefined>;
  create(order: Order): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  updateItems(id: string, items: OrderItem[], subtotal: number, total: number): Promise<Order>;
  remove(id: string, inventoryAdjustments?: OrderInventoryAdjustment[]): Promise<void>;
}

export type { SiteContentRepository };
