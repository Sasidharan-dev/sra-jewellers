"use client";

import { Modal } from "@/components/ui/Modal";
import { MapPin, Clock } from "lucide-react";
import { GoldRateSnapshot } from "@/types";

export function GoldRateModal({
  open,
  onClose,
  snapshot,
}: {
  open: boolean;
  onClose: () => void;
  snapshot: GoldRateSnapshot;
}) {
  const date = new Date(snapshot.updatedAt);
  const updatedAt = Number.isNaN(date.getTime())
    ? snapshot.updatedAt
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <Modal open={open} onClose={onClose} title="Today's Gold Rate" maxWidth="max-w-lg">
      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs leading-5 text-ink-500">
        <MapPin size={13} />
        <span>{snapshot.city}</span>
        <span className="mx-1">•</span>
        <Clock size={13} />
        <span>Updated {updatedAt}</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {snapshot.rates.map((rate) => (
          <div
            key={rate.purity}
            className="flex min-h-[76px] items-center justify-between gap-4 border border-gold-300/60 bg-gold-100/40 px-5 py-4"
          >
            <span className="font-display text-xl text-maroon-900">
              {rate.purity} Gold
            </span>
            <span className="whitespace-nowrap text-xl font-semibold text-maroon-800">
              ₹{rate.ratePerGram.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-ink-500"> /gram</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-ink-300/20 pt-5 text-xs leading-5 text-ink-500">
        Rates shown are indicative and exclude making charges &amp; GST. Final
        billing rate is confirmed in-store at the time of purchase.
      </p>
      {/* TODO(backend): swap goldRateSnapshot for a live feed, e.g. GET /api/gold-rate */}
    </Modal>
  );
}
