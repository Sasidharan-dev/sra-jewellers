"use client";

import { GoldPurity, JewelleryCategory } from "@/types";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  categories: JewelleryCategory[];
  purities: GoldPurity[];
  maxPrice: number;
  inStockOnly: boolean;
}

const purityOptions: GoldPurity[] = ["18K", "22K", "24K"];
const PRICE_CEILING = 350000;

export function FilterSidebar({
  filters,
  onChange,
  hideCategory,
}: {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  hideCategory?: boolean;
}) {
  function toggleCategory(cat: JewelleryCategory) {
    const exists = filters.categories.includes(cat);
    onChange({
      ...filters,
      categories: exists
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });
  }

  function togglePurity(purity: GoldPurity) {
    const exists = filters.purities.includes(purity);
    onChange({
      ...filters,
      purities: exists
        ? filters.purities.filter((p) => p !== purity)
        : [...filters.purities, purity],
    });
  }

  return (
    <aside className="flex flex-col gap-8">
      {!hideCategory && (
        <div>
          <h3 className="eyebrow text-ink-900 mb-3">Category</h3>
          <ul className="flex flex-col gap-2">
            {categories
              .filter((c) => c.name !== "Kids Jewellery")
              .map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="h-3.5 w-3.5 accent-[var(--maroon-800)]"
                    />
                    {cat.name}
                  </label>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="eyebrow text-ink-900 mb-3">Gold Purity</h3>
        <div className="flex flex-wrap gap-2">
          {purityOptions.map((purity) => (
            <button
              key={purity}
              onClick={() => togglePurity(purity)}
              className={cn(
                "px-3 py-1.5 text-xs border transition-colors",
                filters.purities.includes(purity)
                  ? "bg-maroon-800 border-maroon-800 text-cream-100"
                  : "border-ink-300/50 text-ink-700 hover:border-maroon-800"
              )}
            >
              {purity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="eyebrow text-ink-900 mb-3">
          Max Price: ₹{filters.maxPrice.toLocaleString("en-IN")}
        </h3>
        <input
          type="range"
          min={5000}
          max={PRICE_CEILING}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-[var(--gold-500)]"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() =>
              onChange({ ...filters, inStockOnly: !filters.inStockOnly })
            }
            className="h-3.5 w-3.5 accent-[var(--maroon-800)]"
          />
          In stock only
        </label>
      </div>
    </aside>
  );
}

export const defaultFilters: ShopFilters = {
  categories: [],
  purities: [],
  maxPrice: PRICE_CEILING,
  inStockOnly: false,
};
