"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CatalogProduct } from "@/types/catalog";
import type { CartItem } from "@/types/cart";

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CatalogProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const maxQuantity = Math.max(1, product.inventory.stock);

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      maxQuantity,
                      quantity: Math.min(item.quantity + 1, maxQuantity),
                    }
                  : item,
              ),
            };
          }

          return {
            isOpen: true,
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                maxQuantity,
              },
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
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "molotes-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const cartItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const cartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);
