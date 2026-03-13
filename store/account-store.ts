"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AccountStoreState {
  favoriteProductIds: string[];
  toggleFavorite: (productId: string) => void;
}

export const useAccountStore = create<AccountStoreState>()(
  persist(
    (set) => ({
      favoriteProductIds: [],
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
