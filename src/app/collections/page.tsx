import { collections } from "@/data/collections";
import { CollectionCard } from "@/components/category/CategoryCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function CollectionsPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <div className="max-w-lg mt-4 mb-10">
        <span className="divider-ornament eyebrow">Curated For You</span>
        <h1 className="font-display text-3xl text-maroon-900 mt-2">
          Offers &amp; Collections
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          Explore jewellery grouped by occasion, style and craftsmanship.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
