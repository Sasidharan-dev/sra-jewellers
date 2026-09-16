import {
  ShoppingBag,
  Hammer,
  ShieldCheck,
  Truck,
  Gift,
  Gem,
  Headphones,
} from "lucide-react";

const steps = [
  { icon: ShoppingBag, title: "Place Order", desc: "Choose your jewellery or customize your design" },
  { icon: Hammer, title: "Crafting", desc: "Our experts craft your order with perfection" },
  { icon: ShieldCheck, title: "Quality Check", desc: "Every piece goes through strict quality checking" },
  { icon: Truck, title: "Shipped", desc: "Carefully packed and shipped to your door" },
  { icon: Gift, title: "Delivered", desc: "Your precious jewellery, safely delivered" },
];

const badges = [
  { icon: Gem, title: "BIS Hallmarked Jewellery", subtitle: "100% Certified" },
  { icon: Truck, title: "Free Shipping", subtitle: "On all orders above ₹10,000" },
  { icon: ShieldCheck, title: "Secure Payments", subtitle: "100% Safe & Secure" },
  { icon: Headphones, title: "Lifetime Maintenance", subtitle: "Cleaning & Repairs" },
];

export function HowItWorks() {
  return (
    <section className="py-14 bg-cream-200">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="divider-ornament eyebrow justify-center">
            How It Works
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-2.5">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 text-maroon-800">
                <step.icon size={22} />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-maroon-900 text-[10px] text-cream-100">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-ink-900">{step.title}</h4>
              <p className="text-xs text-ink-500 max-w-[9rem]">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-cream-100 card-shadow px-6 py-6">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-3">
              <badge.icon size={22} className="text-gold-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">{badge.title}</p>
                <p className="text-xs text-ink-500">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
