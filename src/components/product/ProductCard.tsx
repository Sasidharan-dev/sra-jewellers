"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { formatINR, cn } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";
import { useHasMounted } from "@/lib/useHasMounted";

const flagStyles: Record<string, string> = {
  Bestseller: "bg-maroon-800 text-cream-100",
  "New Arrival": "bg-gold-500 text-maroon-950",
  Featured: "bg-ink-900 text-cream-100",
};

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const mounted = useHasMounted();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  return (
    <div className="group relative flex flex-col bg-cream-100 border border-ink-300/20 card-shadow transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-cream-300">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.flags.map((flag) => (
            <span
              key={flag}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                flagStyles[flag]
              )}
            >
              {flag}
            </span>
          ))}
        </div>

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream-100/90 text-ink-700 hover:text-maroon-800"
        >
          <Heart
            size={15}
            fill={mounted && isWishlisted ? "currentColor" : "none"}
            className={mounted && isWishlisted ? "text-maroon-700" : ""}
          />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 bg-maroon-900/90 py-2 text-xs font-medium text-cream-100 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Eye size={13} /> Quick View
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[10px] uppercase tracking-wider text-gold-600">
          {product.goldPurity} · {product.weightGrams}g
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-[15px] leading-snug text-ink-900 line-clamp-2 hover:text-maroon-800">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-ink-500">
          <Star size={12} className="fill-gold-500 text-gold-500" />
          {product.rating} ({product.reviewCount})
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-base font-semibold text-maroon-900">
            {formatINR(product.price)}
          </span>
          {!product.inStock && (
            <span className="text-[10px] font-medium text-maroon-600">
              Out of stock
            </span>
          )}
        </div>
        <button
          disabled={!product.inStock}
          onClick={() => {
            addItem(product.id, 1);
            showToast(`${product.name} added to cart`);
          }}
          className="mt-2 flex items-center justify-center gap-2 border border-maroon-800 py-2 text-xs font-medium text-maroon-800 transition-colors hover:bg-maroon-800 hover:text-cream-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-maroon-800"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
