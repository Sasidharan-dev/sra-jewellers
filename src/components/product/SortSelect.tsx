"use client";

import { Select } from "@/components/ui/Input";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <Select
      aria-label="Sort products"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="!w-auto"
    >
      <option value="featured">Sort: Featured</option>
      <option value="newest">Sort: Newest</option>
      <option value="price-asc">Sort: Price — Low to High</option>
      <option value="price-desc">Sort: Price — High to Low</option>
    </Select>
  );
}

export function sortProducts<T extends { price: number; flags: string[] }>(
  products: T[],
  sort: SortOption
): T[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort(
        (a, b) => Number(b.flags.includes("New Arrival")) - Number(a.flags.includes("New Arrival"))
      );
    default:
      return copy.sort(
        (a, b) => Number(b.flags.includes("Featured")) - Number(a.flags.includes("Featured"))
      );
  }
}
