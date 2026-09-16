"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomDesignRequest } from "@/types";

interface CustomDesignState {
  requests: CustomDesignRequest[];
  addRequest: (request: CustomDesignRequest) => void;
}

// TODO(backend): Replace with POST /api/custom-design-requests. The uploaded
// file itself is never persisted to localStorage — only its file name is
// stored here for the confirmation screen; the real backend should accept
// multipart/form-data with the actual file.
export const useCustomDesignStore = create<CustomDesignState>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: (request) =>
        set({ requests: [request, ...get().requests] }),
    }),
    { name: "sra-custom-design-requests" }
  )
);
