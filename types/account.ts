import type { Order } from "@/types/order";

export type PreferredContact = "whatsapp" | "telefono" | "email";
export type LoyaltyTier = "Base" | "Bronce" | "Plata" | "Oro";

export interface LoyaltyProfile {
  isFrequentCustomer: boolean;
  tier: LoyaltyTier;
  points: number;
  availableCredit: number;
  benefits: string[];
  note?: string;
}

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
  loyalty: LoyaltyProfile;
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
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  role: "admin" | "user";
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  activeOrderCount: number;
  hasAddress: boolean;
  lastOrderAt?: string;
  loyalty: LoyaltyProfile;
  benefitsCount: number;
  tags: string[];
}

export interface AccountDirectoryEntry {
  profile: UserAccountProfile;
  orders: UserPanelOrder[];
}
