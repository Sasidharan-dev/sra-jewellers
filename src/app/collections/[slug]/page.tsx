import { notFound } from "next/navigation";
import Image from "next/image";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JewelleryCategory } from "@/types";

const collectionCategoryMap: Record<string, JewelleryCategory[]> = {
  "bridal-collection": ["Bridal Jewellery", "Necklaces"],
  "everyday-gold": ["Chains", "Bracelets", "Pendants"],
  "festive-collection": ["Necklaces", "Earrings", "Bangles"],
  "diamond-collection": ["Rings", "Pendants", "Earrings"],
  "traditional-collection": ["Necklaces", "Bangles", "Earrings"],
  "modern-collection": ["Rings", "Chains", "Bracelets"],
};

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const relevantCategories = collectionCategoryMap[slug] ?? [];
  const collectionProducts = products
    .filter((p) => relevantCategories.includes(p.category))
    .slice(0, 12);

  return (
    <div>
      <div className="relative h-64 sm:h-80 bg-maroon-950">
        <Image src={collection.image} alt={collection.name} fill className="object-cover opacity-45" />
        <div className="relative container-page h-full flex flex-col justify-end pb-8 text-cream-100">
          <span className="eyebrow text-gold-400">{collection.tagline}</span>
          <h1 className="font-display text-4xl mt-1">{collection.name}</h1>
          <p className="text-sm text-cream-300/80 mt-2 max-w-lg">{collection.description}</p>
        </div>
      </div>

      <div className="container-page py-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: collection.name },
          ]}
        />
        <div className="mt-8">
          <ProductGrid products={collectionProducts} />
        </div>
      </div>
    </div>
  );
}
