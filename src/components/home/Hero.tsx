import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { ShieldCheck, Truck, Gem, RotateCcw, ArrowRight, PackageSearch } from "lucide-react";

const trustPoints = [
  { icon: ShieldCheck, title: "100% Hallmarked", subtitle: "BIS Certified Jewellery" },
  { icon: Truck, title: "Secure Delivery", subtitle: "Insured & Safe" },
  { icon: Gem, title: "Custom Made", subtitle: "Just for You" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle Free" },
];

export function Hero() {
  return (
    <section className="bg-maroon-950 text-cream-100">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-14 lg:py-20">
        <div>
          <span className="divider-ornament eyebrow text-gold-400">
            Timeless Beauty
          </span>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mt-4">
            Crafted to Perfection,{" "}
            <span className="text-gold-400">Delivered with Trust</span>
          </h1>
          <p className="mt-4 text-cream-300/80 max-w-md">
            Exquisite designs. Pure craftsmanship. Made just for you.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton
              href="/shop"
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Explore Collections
            </LinkButton>
            <LinkButton
              href="/track-order"
              variant="outline"
              size="lg"
              icon={<PackageSearch size={16} />}
              className="!border-cream-100/40 !text-cream-100 hover:!bg-cream-100 hover:!text-maroon-900"
            >
              Track Your Order
            </LinkButton>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-2">
                <point.icon size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold">{point.title}</p>
                  <p className="text-[11px] text-cream-300/60">{point.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1722410180687-b05b50922362?auto=format&fit=crop&w=1200&q=80"
            alt="Handcrafted gold necklace and earrings from SRA Jewellers"
            fill
            priority
            sizes="600px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
