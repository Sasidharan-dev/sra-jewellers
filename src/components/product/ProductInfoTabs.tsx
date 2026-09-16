"use client";

import { FormEvent, useEffect, useState } from "react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Truck, RotateCcw, Sparkles, Gem } from "lucide-react";

const tabs = [
  { id: "description", label: "Description" },
  { id: "delivery", label: "Delivery" },
  { id: "returns", label: "Return Policy" },
  { id: "care", label: "Jewellery Care" },
  { id: "reviews", label: "Reviews" },
] as const;

export function ProductInfoTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("description");
  const [reviews, setReviews] = useState<{ id: string; name: string; rating: number; comment: string }[]>([]);
  const [reviewMessage, setReviewMessage] = useState("");
  useEffect(() => { fetch(`/api/products/${product.slug}/reviews`).then(async (response) => { if (response.ok) setReviews((await response.json()).reviews); }).catch(() => undefined); }, [product.slug]);
  async function submitReview(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const response = await fetch(`/api/products/${product.slug}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: Number(form.get("rating")), comment: form.get("comment") }) }); const result = await response.json(); if (!response.ok) { setReviewMessage(result.error || "Please sign in to review"); return; } setReviews([result.review, ...reviews]); setReviewMessage("Review submitted successfully."); event.currentTarget.reset(); }

  return (
    <div className="mt-14">
      <div className="flex flex-wrap gap-6 border-b border-ink-300/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              active === tab.id
                ? "text-maroon-900 border-gold-500"
                : "text-ink-500 border-transparent hover:text-ink-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6 text-sm text-ink-700 leading-relaxed max-w-2xl">
        {active === "description" && (
          <div className="flex flex-col gap-4">
            <p>{product.description}</p>
            {product.stoneDetails && (
              <p className="flex items-start gap-2">
                <Gem size={15} className="text-gold-600 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-ink-900">Stone Details: </strong>
                  {product.stoneDetails}
                </span>
              </p>
            )}
          </div>
        )}
        {active === "delivery" && (
          <p className="flex items-start gap-2">
            <Truck size={15} className="text-gold-600 mt-0.5 shrink-0" />
            Insured shipping in 5–9 business days across India. Orders above
            ₹10,000 ship free; a tracking link is shared once the piece is
            dispatched.
          </p>
        )}
        {active === "returns" && (
          <p className="flex items-start gap-2">
            <RotateCcw size={15} className="text-gold-600 mt-0.5 shrink-0" />
            7-day no-questions-asked returns on unworn jewellery in original
            packaging. Customised and engraved pieces are non-returnable.
          </p>
        )}
        {active === "care" && (
          <p className="flex items-start gap-2">
            <Sparkles size={15} className="text-gold-600 mt-0.5 shrink-0" />
            {product.careInfo}
          </p>
        )}
        {active === "reviews" && (
          <div className="flex flex-col gap-6">
            <form onSubmit={submitReview} className="border border-ink-300/25 bg-cream-100 p-4 flex flex-col gap-3">
              <p className="font-medium text-maroon-900">Share your experience</p>
              <select name="rating" defaultValue="5" className="border border-ink-300/50 bg-cream-100 px-3 py-2"><option value="5">★★★★★ Excellent</option><option value="4">★★★★ Very good</option><option value="3">★★★ Good</option><option value="2">★★ Needs improvement</option><option value="1">★ Poor</option></select>
              <textarea name="comment" required placeholder="Write your review" className="min-h-24 border border-ink-300/50 bg-cream-100 px-3 py-2" />
              <button className="self-start bg-maroon-800 px-4 py-2 text-sm text-cream-100">Submit Review</button>
              {reviewMessage && <p className="text-xs text-ink-500">{reviewMessage}</p>}
            </form>
            {reviews.length === 0 ? <p className="text-ink-500">No reviews yet.</p> : reviews.map((review) => <div key={review.id} className="border-b border-ink-300/20 pb-4"><div className="flex justify-between"><strong>{review.name}</strong><span className="text-gold-600">{"★".repeat(review.rating)}</span></div><p className="mt-1 text-ink-600">{review.comment}</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
