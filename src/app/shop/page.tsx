"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, defaultFilters, ShopFilters } from "@/components/product/FilterSidebar";
import { SortSelect, SortOption, sortProducts } from "@/components/product/SortSelect";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState<ShopFilters>({
    ...defaultFilters,
    categories: categoryParam ? [categoryParam as ShopFilters["categories"][number]] : [],
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.purities.length && !filters.purities.includes(p.goldPurity)) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });
    list = sortProducts(list, sort);
    return list;
  }, [filters, sort]);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mt-4 flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="divider-ornament eyebrow">Full Catalogue</span>
          <h1 className="font-display text-3xl text-maroon-900 mt-2">
            All Jewellery
          </h1>
          <p className="text-sm text-ink-500 mt-1">{filtered.length} designs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 border border-ink-300/50 px-3.5 py-2.5 text-sm"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-10">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-maroon-950/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-cream-100 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg text-maroon-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
