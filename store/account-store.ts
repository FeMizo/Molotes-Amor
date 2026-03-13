"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { primaryAccountOrders, primaryAccountProfile } from "@/data/account";
import type {
  UserAccountProfile,
  UserAddress,
  UserPanelOrder,
} from "@/types/account";

interface AccountStoreState {
  profile: UserAccountProfile;
  trackedOrders: UserPanelOrder[];
  favoriteProductIds: string[];
  updateProfile: (
    patch: Partial<
      Omit<UserAccountProfile, "addresses"> & {
        addresses: UserAddress[];
      }
    >,
  ) => void;
  saveAddress: (address: UserAddress) => void;
  removeAddress: (addressId: string) => void;
  markPasswordChanged: () => void;
  rememberOrder: (order: UserPanelOrder) => void;
  toggleFavorite: (productId: string) => void;
}

export const useAccountStore = create<AccountStoreState>()(
  persist(
    (set) => ({
      profile: primaryAccountProfile,
      trackedOrders: primaryAccountOrders,
      favoriteProductIds: [],
      updateProfile: (patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
            addresses: patch.addresses ?? state.profile.addresses,
          },
        })),
      saveAddress: (address) =>
        set((state) => {
          const currentAddresses = state.profile.addresses;
          const exists = currentAddresses.some((item) => item.id === address.id);
          const nextAddresses = exists
            ? currentAddresses.map((item) => (item.id === address.id ? address : item))
            : [...currentAddresses, address];
          const addressesWithDefault = nextAddresses.map((item) => ({
            ...item,
            isDefault: address.isDefault ? item.id === address.id : item.isDefault,
          }));
          const normalizedAddresses = addressesWithDefault.some((item) => item.isDefault)
            ? addressesWithDefault
            : addressesWithDefault.map((item, index) => ({
                ...item,
                isDefault: index === 0,
              }));

          return {
            profile: {
              ...state.profile,
              addresses: normalizedAddresses,
            },
          };
        }),
      removeAddress: (addressId) =>
        set((state) => {
          const nextAddresses = state.profile.addresses.filter(
            (address) => address.id !== addressId,
          );

          return {
            profile: {
              ...state.profile,
              addresses: nextAddresses.map((address, index) => ({
                ...address,
                isDefault: address.isDefault || index === 0,
              })),
            },
          };
        }),
      markPasswordChanged: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            passwordUpdatedAt: new Date().toISOString(),
          },
        })),
      rememberOrder: (order) =>
        set((state) => {
          const nextOrders = [order, ...state.trackedOrders.filter((item) => item.id !== order.id)];
          return {
            trackedOrders: nextOrders.sort(
              (left, right) =>
                +new Date(right.createdAt) - +new Date(left.createdAt),
            ),
          };
        }),
      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteProductIds: state.favoriteProductIds.includes(productId)
            ? state.favoriteProductIds.filter((id) => id !== productId)
            : [productId, ...state.favoriteProductIds],
        })),
    }),
    {
      name: "molotes-account",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
