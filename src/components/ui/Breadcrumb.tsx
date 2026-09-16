import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-maroon-800">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-900">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight size={12} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
