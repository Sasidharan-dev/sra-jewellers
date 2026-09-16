"use client";

import { useEffect, useState } from "react";
import { Gem } from "lucide-react";
import { goldRateSnapshot } from "@/data/goldRates";
import { GoldRateSnapshot } from "@/types";
import { GoldRateModal } from "./GoldRateModal";

export function GoldRateWidget() {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<GoldRateSnapshot>(goldRateSnapshot);
  useEffect(() => { fetch("/api/gold-rate").then((response) => response.ok ? response.json() : null).then((data) => { if (data?.rates) setSnapshot(data); }).catch(() => undefined); }, []);
  const rate22k = snapshot.rates.find((r) => r.purity === "22K");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 bg-maroon-900 text-cream-100 pl-3 pr-4 py-2.5 card-shadow hover:bg-maroon-800 transition-colors"
        aria-haspopup="dialog"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-maroon-950">
          <Gem size={14} />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider text-gold-300">
            Today&apos;s 22K Gold
          </span>
          <span className="block text-sm font-semibold">
            ₹{rate22k?.ratePerGram.toLocaleString("en-IN")}/g
          </span>
        </span>
      </button>
      <GoldRateModal open={open} onClose={() => setOpen(false)} snapshot={snapshot} />
    </>
  );
}
