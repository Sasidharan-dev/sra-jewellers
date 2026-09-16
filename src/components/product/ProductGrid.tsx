"use client";

import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";

export function ProductGrid({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-xl text-maroon-900 mb-2">
          No jewellery found
        </p>
        <p className="text-sm text-ink-500 max-w-sm">
          Try adjusting your filters or search term — or explore our featured
          collections instead.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
