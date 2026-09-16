"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ClipboardList } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";

export function TrackOrderPanel() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    router.push(`/track-order?orderId=${encodeURIComponent(orderId.trim())}`);
  }

  return (
    <section className="bg-cream-300/50 py-10">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-6 bg-cream-100 card-shadow p-6 md:p-8">
          <div className="flex items-start gap-4 md:pr-6 md:border-r md:border-ink-300/30">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-300 text-maroon-800 shrink-0">
              <Package size={20} />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-lg text-maroon-900">
                Track Your Order
              </h3>
              <p className="text-sm text-ink-500 mt-1 mb-4">
                Enter your Order ID to check the current status of your order
              </p>
              <form onSubmit={handleTrack} className="flex gap-2">
                <label htmlFor="hero-order-id" className="sr-only">
                  Order ID
                </label>
                <input
                  id="hero-order-id"
                  placeholder="Enter Order ID (e.g. SRA-2026-00124)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="min-w-0 flex-1 border border-ink-300/50 bg-cream-100 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                />
                <Button type="submit">Track Order</Button>
              </form>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-300 text-maroon-800 shrink-0">
              <ClipboardList size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg text-maroon-900">
                View Your Orders
              </h3>
              <p className="text-sm text-ink-500 mt-1 mb-4">
                Login to view all your orders and order history
              </p>
              <LinkButton href="/track-order" variant="outline">
                Login / Sign Up
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
