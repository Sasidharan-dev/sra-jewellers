"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  productIds: string[];
  addView: (productId: string) => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addView: (productId) => {
        const withoutCurrent = get().productIds.filter((id) => id !== productId);
        set({ productIds: [productId, ...withoutCurrent].slice(0, MAX_ITEMS) });
      },
    }),
    { name: "sra-recently-viewed" }
  )
);
