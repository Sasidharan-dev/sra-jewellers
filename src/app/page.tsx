import { Hero } from "@/components/home/Hero";
import { TrackOrderPanel } from "@/components/home/TrackOrderPanel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedCategories, FeaturedCollections } from "@/components/home/FeaturedSections";
import { ProductRail } from "@/components/home/ProductRail";
import { CustomDesignCTA } from "@/components/home/CustomDesignCTA";
import {
  WhyChooseUs,
  TestimonialsSection,
  OffersSection,
  InstagramGallery,
} from "@/components/home/InfoSections";
import { products } from "@/data/products";

export default function HomePage() {
  const featured = products.filter((p) => p.flags.includes("Featured"));
  const newArrivals = products.filter((p) => p.flags.includes("New Arrival"));
  const bestSellers = products.filter((p) => p.flags.includes("Bestseller"));
  const exclusive = products.filter((p) => p.category === "Bridal Jewellery");

  return (
    <>
      <Hero />
      <TrackOrderPanel />
      <HowItWorks />
      <FeaturedCategories />
      <ProductRail eyebrow="Handpicked" title="Featured Jewellery" products={featured} />
      <ProductRail eyebrow="Just In" title="New Arrivals" products={newArrivals} />
      <ProductRail eyebrow="Customer Favourites" title="Best Sellers" products={bestSellers} />
      <FeaturedCollections />
      <ProductRail
        eyebrow="For The Big Day"
        title="Exclusive Bridal Collection"
        products={exclusive}
        viewAllHref="/category/bridal-jewellery"
      />
      <CustomDesignCTA />
      <WhyChooseUs />
      <TestimonialsSection />
      <OffersSection />
      <InstagramGallery />
    </>
  );
}
