import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { CategoryCard, CollectionCard } from "@/components/category/CategoryCard";

export function FeaturedCategories() {
  return (
    <section className="py-14">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="divider-ornament eyebrow">Shop By</span>
            <h2 className="font-display text-3xl text-maroon-900 mt-2">
              Our Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm text-maroon-800 hover:text-maroon-950"
          >
            View All Jewellery <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCollections() {
  return (
    <section className="py-14 bg-cream-200">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="divider-ornament eyebrow">Curated For You</span>
            <h2 className="font-display text-3xl text-maroon-900 mt-2">
              Our Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="hidden sm:flex items-center gap-1.5 text-sm text-maroon-800 hover:text-maroon-950"
          >
            View All Collections <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.slice(0, 3).map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
