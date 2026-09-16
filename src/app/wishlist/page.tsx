"use client";

import { products } from "@/data/products";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useHasMounted } from "@/lib/useHasMounted";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LinkButton } from "@/components/ui/Button";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const mounted = useHasMounted();
  const ids = useWishlistStore((s) => s.productIds);
  const items = products.filter((p) => ids.includes(p.id));

  if (!mounted) return null;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="font-display text-3xl text-maroon-900 mt-3 mb-8">
        Your Wishlist
      </h1>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={40} className="text-ink-300 mb-4" />
          <p className="font-display text-xl text-maroon-900 mb-2">
            Your wishlist is empty
          </p>
          <p className="text-sm text-ink-500 mb-6 max-w-sm">
            Tap the heart icon on any product to save it here for later.
          </p>
          <LinkButton href="/shop">Explore Jewellery</LinkButton>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
