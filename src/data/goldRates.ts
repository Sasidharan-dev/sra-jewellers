// TODO(backend): Replace with a live gold-rate API, e.g. GET /api/gold-rate?city=
import { GoldRateSnapshot } from "@/types";

export const goldRateSnapshot: GoldRateSnapshot = {
  city: "Coimbatore",
  updatedAt: "Today, 10:30 AM",
  rates: [
    { purity: "24K", ratePerGram: 15317 },
    { purity: "22K", ratePerGram: 14040 },
    { purity: "18K", ratePerGram: 11810 },
  ],
};
