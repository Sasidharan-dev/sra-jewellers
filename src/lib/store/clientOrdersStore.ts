"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockOrder } from "@/types";

interface ClientOrdersState {
  orders: Record<string, MockOrder>;
  addOrder: (order: MockOrder) => void;
}

// TODO(backend): Once a real order API exists, this store becomes a thin
// cache in front of GET/POST /api/orders instead of the source of truth.
export const useClientOrdersStore = create<ClientOrdersState>()(
  persist(
    (set, get) => ({
      orders: {},
      addOrder: (order) =>
        set({ orders: { ...get().orders, [order.orderId]: order } }),
    }),
    { name: "sra-client-orders" }
  )
);
