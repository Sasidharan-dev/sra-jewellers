"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, defaultFilters, ShopFilters } from "@/components/product/FilterSidebar";
import { SortSelect, SortOption, sortProducts } from "@/components/product/SortSelect";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = use(params);
  const category = categories.find((c) => c.slug === categorySlug);

  const [filters, setFilters] = useState<ShopFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("featured");

  const categoryProducts = useMemo(
    () => (category ? products.filter((p) => p.category === category.name) : []),
    [category]
  );

  const filtered = useMemo(() => {
    const list = categoryProducts.filter((p) => {
      if (filters.purities.length && !filters.purities.includes(p.goldPurity)) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [categoryProducts, filters, sort]);

  if (!category) notFound();

  return (
    <div>
      <div className="relative h-48 sm:h-60 bg-maroon-950">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover opacity-40"
        />
        <div className="relative container-page h-full flex flex-col justify-end pb-6 text-cream-100">
          <span className="eyebrow text-gold-400">Category</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">{category.name}</h1>
          <p className="text-sm text-cream-300/80 mt-1 max-w-md">{category.description}</p>
        </div>
      </div>

      <div className="container-page py-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category.name },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-ink-500">{filtered.length} designs</p>
          <SortSelect value={sort} onChange={setSort} />
        </div>
        <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-10">
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={setFilters} hideCategory />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
