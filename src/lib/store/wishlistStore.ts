"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  replace: (productIds: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const exists = get().productIds.includes(productId);
        const productIds = exists
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId];
        set({ productIds });
        fetch("/api/account/wishlist", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productIds }) }).catch(() => undefined);
      },
      isWishlisted: (productId) => get().productIds.includes(productId),
      replace: (productIds) => set({ productIds }),
    }),
    { name: "sra-wishlist" }
  )
);
