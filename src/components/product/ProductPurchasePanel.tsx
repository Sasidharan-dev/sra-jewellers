"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Zap, Star } from "lucide-react";
import { Product } from "@/types";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useToastStore } from "@/lib/store/toastStore";
import { useRecentlyViewedStore } from "@/lib/store/recentlyViewedStore";
import { useHasMounted } from "@/lib/useHasMounted";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const mounted = useHasMounted();

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const showToast = useToastStore((s) => s.show);
  const addView = useRecentlyViewedStore((s) => s.addView);

  useEffect(() => {
    addView(product.id);
  }, [product.id, addView]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-[11px] uppercase tracking-wider text-gold-600">
          {product.jewelleryType} · {product.id}
        </span>
        <h1 className="font-display text-3xl text-maroon-900 mt-1">
          {product.name}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-ink-500">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(product.rating)
                    ? "fill-gold-500 text-gold-500"
                    : "text-ink-300"
                }
              />
            ))}
          </div>
          {product.rating} ({product.reviewCount} reviews)
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 border-y border-ink-300/25 py-4 text-sm">
        <div>
          <span className="block text-xs text-ink-500">Gold Purity</span>
          <span className="font-medium text-ink-900">{product.goldPurity}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-500">Weight</span>
          <span className="font-medium text-ink-900">{product.weightGrams}g</span>
        </div>
        <div>
          <span className="block text-xs text-ink-500">Availability</span>
          <span className={cn("font-medium", product.inStock ? "text-emerald-700" : "text-maroon-600")}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div>
        <span className="text-2xl font-semibold text-maroon-900">
          {formatINR(product.price)}
        </span>
        <p className="text-xs text-ink-500 mt-1">
          + {formatINR(product.makingCharge)} making charges (shown separately at checkout)
        </p>
      </div>

      {product.sizes && (
        <div>
          <span className="text-xs font-medium text-ink-700 mb-2 block">
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "h-9 w-9 text-sm border transition-colors",
                  size === s
                    ? "bg-maroon-800 border-maroon-800 text-cream-100"
                    : "border-ink-300/50 text-ink-700 hover:border-maroon-800"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="text-xs font-medium text-ink-700 mb-2 block">Quantity</span>
        <div className="inline-flex items-center border border-ink-300/50">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3.5 py-2 text-ink-700 hover:bg-cream-300"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-4 text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="px-3.5 py-2 text-ink-700 hover:bg-cream-300"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          fullWidth
          disabled={!product.inStock}
          icon={<ShoppingBag size={16} />}
          onClick={() => {
            addItem(product.id, quantity, size);
            showToast(`${product.name} added to cart`);
          }}
        >
          Add to Cart
        </Button>
        <Button
          fullWidth
          disabled={!product.inStock}
          icon={<Zap size={16} />}
          onClick={() => {
            addItem(product.id, quantity, size);
            router.push("/checkout");
          }}
        >
          Buy Now
        </Button>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="flex items-center justify-center h-11 w-11 shrink-0 border border-ink-300/50 hover:border-maroon-800 self-center sm:self-auto"
        >
          <Heart
            size={17}
            fill={mounted && isWishlisted ? "currentColor" : "none"}
            className={mounted && isWishlisted ? "text-maroon-700" : "text-ink-700"}
          />
        </button>
      </div>
    </div>
  );
}
