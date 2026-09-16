"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  addItem: (productId: string, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (productId, quantity = 1, size) => {
        const existing = get().lines.find(
          (l) => l.productId === productId && l.size === size
        );
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.productId === productId && l.size === size
                ? { ...l, quantity: l.quantity + quantity }
                : l
            ),
          });
        } else {
          set({ lines: [...get().lines, { productId, quantity, size }] });
        }
      },
      removeItem: (productId, size) => {
        set({
          lines: get().lines.filter(
            (l) => !(l.productId === productId && l.size === size)
          ),
        });
      },
      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.productId === productId && l.size === size
              ? { ...l, quantity }
              : l
          ),
        });
      },
      clearCart: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "sra-cart" }
  )
);
