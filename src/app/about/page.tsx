import Image from "next/image";
import { Gem, ShieldCheck, HeartHandshake, Hammer } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const values = [
  {
    icon: Hammer,
    title: "Craftsmanship",
    desc: "Every piece passes through the hands of experienced goldsmiths who combine traditional techniques with modern finishing.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Purity",
    desc: "All jewellery is BIS hallmarked, with purity and weight clearly declared before you buy.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-First Approach",
    desc: "From transparent pricing to easy returns, every process is designed around your confidence and comfort.",
  },
  {
    icon: Gem,
    title: "Jewellery Expertise",
    desc: "Whether it's a daily-wear chain or a full bridal set, our team helps you choose what genuinely suits you.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-64 sm:h-80 bg-maroon-950">
        <Image
          src="https://images.unsplash.com/photo-1772442125267-7640b4b5f2fe?auto=format&fit=crop&w=1400&q=80"
          alt="SRA Jewellers craftsmanship"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative container-page h-full flex flex-col justify-end pb-8 text-cream-100">
          <span className="eyebrow text-gold-400">Our Story</span>
          <h1 className="font-display text-4xl mt-1">About SRA Jewellers</h1>
        </div>
      </div>

      <div className="container-page py-10">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

        <div className="grid lg:grid-cols-2 gap-10 items-center mt-8">
          <div>
            <span className="divider-ornament eyebrow">Brand Story</span>
            <h2 className="font-display text-3xl text-maroon-900 mt-3">
              Jewellery Made With Intention
            </h2>
            <p className="text-sm text-ink-700 leading-relaxed mt-4">
              SRA Jewellers was built around a simple idea: buying gold
              jewellery should feel as trustworthy and considered as the
              piece you eventually wear. From everyday chains to elaborate
              bridal sets, every design that reaches our catalogue is
              reviewed for craftsmanship, purity and finish before it&apos;s
              shown to a customer.
            </p>
            <p className="text-sm text-ink-700 leading-relaxed mt-4">
              We work with skilled artisans who bring decades of hands-on
              goldsmithing experience, and we pair that craft with clear,
              itemised pricing — gold rate, weight and making charges shown
              separately, with nothing hidden until checkout.
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1721103418312-b0057a8c31c2?auto=format&fit=crop&w=900&q=80"
              alt="Handcrafted SRA Jewellers gold necklace"
              fill
              sizes="600px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center gap-3 p-6 border border-ink-300/20 bg-cream-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-maroon-800">
                <v.icon size={22} />
              </span>
              <h3 className="text-sm font-semibold text-ink-900">{v.title}</h3>
              <p className="text-xs text-ink-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
