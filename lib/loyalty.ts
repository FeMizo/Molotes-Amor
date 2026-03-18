import type { LoyaltyProfile, LoyaltyTier } from "@/types/account";

export const loyaltyTierOptions: LoyaltyTier[] = [
  "Base",
  "Bronce",
  "Plata",
  "Oro",
];

export const defaultLoyaltyProfile = (): LoyaltyProfile => ({
  isFrequentCustomer: false,
  tier: "Base",
  points: 0,
  availableCredit: 0,
  benefits: [],
  note: undefined,
});

export const normalizeLoyaltyProfile = (
  loyalty?: Partial<LoyaltyProfile>,
): LoyaltyProfile => ({
  ...defaultLoyaltyProfile(),
  ...loyalty,
  benefits: (loyalty?.benefits ?? []).map((benefit) => benefit.trim()).filter(Boolean),
  note: loyalty?.note?.trim() || undefined,
});
