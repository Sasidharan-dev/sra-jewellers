import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryInfo, Collection } from "@/types";

export function CategoryCard({ category }: { category: CategoryInfo }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border border-gold-300/50 bg-cream-300">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="120px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-sm font-medium text-ink-900 group-hover:text-maroon-800">
        {category.name}
      </span>
    </Link>
  );
}

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden card-shadow"
    >
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/85 via-maroon-950/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-cream-100">
        <span className="text-[10px] uppercase tracking-widest text-gold-300">
          {collection.tagline}
        </span>
        <h3 className="font-display text-xl mt-1 flex items-center gap-2">
          {collection.name}
          <ArrowRight
            size={16}
            className="translate-x-0 transition-transform group-hover:translate-x-1"
          />
        </h3>
      </div>
    </Link>
  );
}
