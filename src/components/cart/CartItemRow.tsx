"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";

export function CartItemRow({
  product,
  quantity,
  size,
}: {
  product: Product;
  quantity: number;
  size?: string;
}) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-ink-300/25">
      <Link href={`/product/${product.slug}`} className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 bg-cream-300">
        <Image src={product.image} alt={product.name} fill sizes="112px" className="object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-display text-base text-ink-900 truncate hover:text-maroon-800">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-ink-500 mt-1">
              {product.goldPurity} · {product.weightGrams}g
              {size ? ` · Size ${size}` : ""}
            </p>
          </div>
          <button
            onClick={() => removeItem(product.id, size)}
            aria-label={`Remove ${product.name} from cart`}
            className="text-ink-500 hover:text-maroon-700 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center border border-ink-300/50">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1, size)}
              className="px-3 py-1.5 text-ink-700 hover:bg-cream-300"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3.5 text-sm">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1, size)}
              className="px-3 py-1.5 text-ink-700 hover:bg-cream-300"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-maroon-900">
            {formatINR(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
