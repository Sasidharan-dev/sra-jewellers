import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductRail({
  title,
  eyebrow,
  products,
  viewAllHref = "/shop",
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="py-14">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="divider-ornament eyebrow">{eyebrow}</span>
            <h2 className="font-display text-3xl text-maroon-900 mt-2">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1.5 text-sm text-maroon-800 hover:text-maroon-950"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
