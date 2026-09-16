import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Gem, HeartHandshake, Award } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { collections } from "@/data/collections";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Certified Hallmark Purity",
    desc: "Every piece is BIS hallmarked and comes with a certificate of purity.",
  },
  {
    icon: Gem,
    title: "Transparent Pricing",
    desc: "Gold rate, weight and making charges are shown separately, with no hidden costs.",
  },
  {
    icon: HeartHandshake,
    title: "Custom-Made For You",
    desc: "Bring your own design and we'll craft it exactly to your requirements.",
  },
  {
    icon: Award,
    title: "Decades of Craftsmanship",
    desc: "Traditional goldsmithing techniques, refined for modern jewellery.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-14">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="divider-ornament eyebrow justify-center">
            Why SRA Jewellers
          </span>
          <h2 className="font-display text-3xl text-maroon-900 mt-2">
            Trusted Craftsmanship, Honest Pricing
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center text-center gap-3 p-6 border border-ink-300/20 bg-cream-100"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-maroon-800">
                <reason.icon size={22} />
              </span>
              <h3 className="text-sm font-semibold text-ink-900">{reason.title}</h3>
              <p className="text-xs text-ink-500">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-14 bg-maroon-950 text-cream-100">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="divider-ornament eyebrow justify-center text-gold-400">
            Customer Stories
          </span>
          <h2 className="font-display text-3xl mt-2">What Our Customers Say</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-cream-100/5 border border-cream-100/15 p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < t.rating ? "fill-gold-400 text-gold-400" : "text-cream-100/25"}
                  />
                ))}
              </div>
              <p className="text-sm text-cream-200/85 mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs font-semibold text-cream-100">{t.name}</p>
              <p className="text-[11px] text-cream-300/60">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OffersSection() {
  return (
    <section className="py-14">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="divider-ornament eyebrow justify-center">Offers</span>
          <h2 className="font-display text-3xl text-maroon-900 mt-2">
            Current Collections &amp; Offers
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {collections.slice(3, 5).map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative flex items-center overflow-hidden bg-cream-300 min-h-[220px]"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="600px"
                className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/85 via-maroon-950/40 to-transparent" />
              <div className="relative z-10 p-8 text-cream-100 max-w-xs">
                <span className="text-xs uppercase tracking-widest text-gold-300">
                  {collection.tagline}
                </span>
                <h3 className="font-display text-2xl mt-2">{collection.name}</h3>
                <p className="text-sm text-cream-300/80 mt-2 line-clamp-2">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const instagramTiles = [
  "1622398925373-3f91b1e275f5",
  "1701777892740-88419a701472",
  "1611107683227-e9060eccd846",
  "1758995116383-f51775896add",
  "1761211106346-939cb32005d7",
  "1722410180687-b05b50922362",
];

export function InstagramGallery() {
  return (
    <section className="py-14 bg-cream-200">
      <div className="container-page">
        <div className="text-center mb-8">
          <span className="divider-ornament eyebrow justify-center">
            @SRAJewellers
          </span>
          <h2 className="font-display text-3xl text-maroon-900 mt-2">
            Follow Our Craft
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {instagramTiles.map((id) => (
            <div key={id} className="relative aspect-square overflow-hidden">
              <Image
                src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`}
                alt="SRA Jewellers Instagram gallery image"
                fill
                sizes="150px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
