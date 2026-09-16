"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { SortSelect, SortOption, sortProducts } from "@/components/product/SortSelect";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [sort, setSort] = useState<SortOption>("featured");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matched = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.jewelleryType.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
    return sortProducts(matched, sort);
  }, [query, sort]);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="mt-4 max-w-lg">
        <SearchBar initialValue={query} autoFocus />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-maroon-900">
          {query ? (
            <>
              Results for &ldquo;{query}&rdquo;{" "}
              <span className="text-sm font-sans text-ink-500 font-normal">
                ({results.length} found)
              </span>
            </>
          ) : (
            "Search for jewellery"
          )}
        </h1>
        {results.length > 0 && <SortSelect value={sort} onChange={setSort} />}
      </div>

      <div className="mt-8">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
