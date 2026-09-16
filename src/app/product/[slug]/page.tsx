import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { RecentlyViewedRail } from "@/components/product/RecentlyViewedRail";
import { ProductRail } from "@/components/home/ProductRail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <div className="container-page py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.category, href: `/category/${product.category === "Bridal Jewellery" ? "bridal-jewellery" : product.category.toLowerCase()}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid lg:grid-cols-2 gap-12">
          <ProductGallery images={[product.image, ...product.gallery]} name={product.name} />
          <ProductPurchasePanel product={product} />
        </div>

        <ProductInfoTabs product={product} />
      </div>

      <ProductRail
        eyebrow="You May Also Like"
        title="Related Jewellery"
        products={related}
        viewAllHref={`/category/${product.category === "Bridal Jewellery" ? "bridal-jewellery" : product.category.toLowerCase()}`}
      />

      <RecentlyViewedRail excludeId={product.id} />
    </div>
  );
}
