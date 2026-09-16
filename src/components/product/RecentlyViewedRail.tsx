"use client";

import { products } from "@/data/products";
import { useRecentlyViewedStore } from "@/lib/store/recentlyViewedStore";
import { ProductCard } from "@/components/product/ProductCard";
import { useHasMounted } from "@/lib/useHasMounted";

export function RecentlyViewedRail({ excludeId }: { excludeId?: string }) {
  const mounted = useHasMounted();
  const ids = useRecentlyViewedStore((s) => s.productIds);

  if (!mounted) return null;
  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="py-14 bg-cream-200">
      <div className="container-page">
        <h2 className="font-display text-2xl text-maroon-900 mb-6">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
