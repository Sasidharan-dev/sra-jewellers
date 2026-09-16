"use client";

import Link from "next/link";
import { Gem, Send } from "lucide-react";
import { useState } from "react";
import { useToastStore } from "@/lib/store/toastStore";

export function Footer() {
  const [email, setEmail] = useState("");
  const showToast = useToastStore((s) => s.show);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO(backend): POST /api/newsletter/subscribe
    showToast("Subscribed! Watch your inbox for new collections.");
    setEmail("");
  }

  return (
    <footer className="bg-maroon-950 text-cream-300">
      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-maroon-950">
              <Gem size={18} />
            </span>
            <span className="font-display text-xl text-cream-100">
              SRA Jewellers
            </span>
          </Link>
          <p className="text-sm text-cream-300/70 max-w-sm mb-5">
            Hallmarked gold jewellery crafted with honest pricing and
            transparent making charges — for everyday wear, festive occasions
            and once-in-a-lifetime celebrations.
          </p>
          <div className="flex items-center gap-3">
            {["f", "in", "yt"].map((label, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-300/25 text-[11px] font-semibold hover:border-gold-400 hover:text-gold-400"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold-400 mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-cream-300/80">
            <li><Link href="/shop" className="hover:text-gold-300">Shop</Link></li>
            <li><Link href="/custom-design" className="hover:text-gold-300">Custom Design</Link></li>
            <li><Link href="/track-order" className="hover:text-gold-300">Track Order</Link></li>
            <li><Link href="/about" className="hover:text-gold-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold-400 mb-4">Customer Support</h4>
          <ul className="space-y-2.5 text-sm text-cream-300/80">
            <li><Link href="/contact" className="hover:text-gold-300">Shipping</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Returns</Link></li>
            <li><Link href="/about" className="hover:text-gold-300">Jewellery Care</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">FAQ</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold-300">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-gold-300">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold-400 mb-4">Stay Updated</h4>
          <p className="text-sm text-cream-300/70 mb-3">
            New arrivals and offers, once in a while.
          </p>
          <form onSubmit={handleSubscribe} className="flex">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 bg-cream-100/10 border border-cream-300/25 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-300/50 outline-none focus:border-gold-400"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center justify-center bg-gold-500 px-3.5 text-maroon-950 hover:bg-gold-400"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream-300/15">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream-300/60">
          <p>© {new Date().getFullYear()} SRA Jewellers. All rights reserved.</p>
          <p>BIS Hallmarked · Frontend demo — not a live storefront</p>
        </div>
      </div>
    </footer>
  );
}
