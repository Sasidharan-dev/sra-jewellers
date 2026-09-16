"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";
import { ShoppingBag, Star } from "lucide-react";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  return (
    <Modal open={!!product} onClose={onClose} maxWidth="max-w-2xl">
      {product && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-cream-300">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gold-600">
              {product.goldPurity} · {product.weightGrams}g · {product.jewelleryType}
            </span>
            <h3 className="font-display text-2xl text-maroon-900 mt-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-ink-500 mt-1">
              <Star size={12} className="fill-gold-500 text-gold-500" />
              {product.rating} ({product.reviewCount} reviews)
            </div>
            <p className="text-sm text-ink-700 mt-3 line-clamp-3">
              {product.description}
            </p>
            <span className="text-xl font-semibold text-maroon-900 mt-4">
              {formatINR(product.price)}
            </span>
            <span className="text-xs text-ink-500">
              + {formatINR(product.makingCharge)} making charges
            </span>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button
                icon={<ShoppingBag size={15} />}
                disabled={!product.inStock}
                onClick={() => {
                  addItem(product.id, 1);
                  showToast(`${product.name} added to cart`);
                }}
              >
                Add to Cart
              </Button>
              <LinkButton variant="outline" href={`/product/${product.slug}`}>
                View Full Details
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
