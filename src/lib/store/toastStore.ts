"use client";

import { create } from "zustand";

export interface ToastMessage {
  id: number;
  message: string;
  variant?: "success" | "info" | "error";
}

interface ToastState {
  toasts: ToastMessage[];
  show: (message: string, variant?: ToastMessage["variant"]) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, variant = "success") => {
    const id = ++counter;
    set({ toasts: [...get().toasts, { id, message, variant }] });
    setTimeout(() => get().dismiss(id), 3200);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
