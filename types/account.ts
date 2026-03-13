import type { Order } from "@/types/order";

export type PreferredContact = "whatsapp" | "telefono" | "email";

export interface UserAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  reference?: string;
  isDefault: boolean;
}

export interface UserAccountProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
  preferredContact: PreferredContact;
  marketingOptIn: boolean;
  passwordUpdatedAt: string;
  addresses: UserAddress[];
}

export interface UserPanelOrder extends Order {
  source: "mock" | "checkout";
  channel: "pickup" | "delivery";
  etaLabel?: string;
  trackingNote: string;
}

export interface UserDashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalSpent: number;
  favoriteCount: number;
  lastOrderAt?: string;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  totalOrders: number;
  totalSpent: number;
  activeOrderCount: number;
  hasAddress: boolean;
  lastOrderAt?: string;
  tags: string[];
}

export interface AccountDirectoryEntry {
  profile: UserAccountProfile;
  orders: UserPanelOrder[];
}
