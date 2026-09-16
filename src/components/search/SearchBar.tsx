"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar({
  className,
  autoFocus,
  initialValue = "",
  onSubmitOverride,
}: {
  className?: string;
  autoFocus?: boolean;
  initialValue?: string;
  onSubmitOverride?: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSubmitOverride) {
      onSubmitOverride(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <div className="flex items-center gap-2 border border-ink-300/50 bg-cream-100 px-3 py-2">
        <Search size={16} className="text-ink-500 shrink-0" />
        <input
          id="site-search"
          type="search"
          autoFocus={autoFocus}
          placeholder="Search rings, necklaces, chains…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-500"
        />
      </div>
    </form>
  );
}
