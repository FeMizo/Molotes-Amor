"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CatalogProduct } from "@/types/catalog";
import type { CartItem, SavedForLaterItem } from "@/types/cart";

const toStoredItem = (product: CatalogProduct, quantity = 1): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  quantity,
  maxQuantity: Math.max(1, product.inventory.stock),
});

const toSavedItem = (item: CartItem): SavedForLaterItem => ({
  ...item,
  savedAt: new Date().toISOString(),
});

const upsertSavedItem = (
  items: SavedForLaterItem[],
  incoming: SavedForLaterItem,
): SavedForLaterItem[] => {
  const existing = items.find((item) => item.id === incoming.id);
  const next = existing
    ? items.map((item) => (item.id === incoming.id ? incoming : item))
    : [incoming, ...items];

  return next.sort((left, right) => +new Date(right.savedAt) - +new Date(left.savedAt));
};

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  savedItems: SavedForLaterItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CatalogProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  saveForLater: (product: CatalogProduct) => void;
  saveCartItemForLater: (id: string) => void;
  moveSavedToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      savedItems: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const maxQuantity = Math.max(1, product.inventory.stock);
          const safeQuantity = Math.max(1, quantity);

          if (existing) {
            return {
              isOpen: true,
              savedItems: state.savedItems.filter((item) => item.id !== product.id),
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      maxQuantity,
                      quantity: Math.min(item.quantity + safeQuantity, maxQuantity),
                    }
                  : item,
              ),
            };
          }

          return {
            isOpen: true,
            savedItems: state.savedItems.filter((item) => item.id !== product.id),
            items: [
              ...state.items,
              toStoredItem(product, Math.min(safeQuantity, maxQuantity)),
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== id) {
                return item;
              }

              const maxQuantity = Math.max(1, item.maxQuantity ?? item.quantity);
              return {
                ...item,
                quantity: Math.min(maxQuantity, Math.max(1, item.quantity + delta)),
              };
            })
            .filter((item) => item.quantity > 0),
        })),
      saveForLater: (product) =>
        set((state) => {
          const cartItem = state.items.find((item) => item.id === product.id);
          const savedSnapshot = toSavedItem(cartItem ?? toStoredItem(product));

          return {
            items: state.items.filter((item) => item.id !== product.id),
            savedItems: upsertSavedItem(state.savedItems, savedSnapshot),
          };
        }),
      saveCartItemForLater: (id) =>
        set((state) => {
          const cartItem = state.items.find((item) => item.id === id);
          if (!cartItem) {
            return state;
          }

          return {
            items: state.items.filter((item) => item.id !== id),
            savedItems: upsertSavedItem(state.savedItems, toSavedItem(cartItem)),
          };
        }),
      moveSavedToCart: (id) =>
        set((state) => {
          const savedItem = state.savedItems.find((item) => item.id === id);
          if (!savedItem) {
            return state;
          }

          const existing = state.items.find((item) => item.id === id);
          const maxQuantity = Math.max(1, savedItem.maxQuantity ?? savedItem.quantity);
          const nextQuantity = existing
            ? Math.min(maxQuantity, existing.quantity + savedItem.quantity)
            : Math.min(maxQuantity, savedItem.quantity);

          return {
            isOpen: true,
            items: existing
              ? state.items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        maxQuantity,
                        quantity: nextQuantity,
                      }
                    : item,
                )
              : [
                  ...state.items,
                  {
                    ...savedItem,
                    quantity: nextQuantity,
                    maxQuantity,
                  },
                ],
            savedItems: state.savedItems.filter((item) => item.id !== id),
          };
        }),
      removeSavedItem: (id) =>
        set((state) => ({
          savedItems: state.savedItems.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "molotes-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, savedItems: state.savedItems }),
    },
  ),
);

export const cartItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const cartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);
