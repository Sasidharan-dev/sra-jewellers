"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./MobileDrawer";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useHasMounted } from "@/lib/useHasMounted";
import { SearchBar } from "@/components/search/SearchBar";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Custom Design", href: "/custom-design" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useHasMounted();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const replaceWishlist = useWishlistStore((s) => s.replace);

  useEffect(() => {
    fetch("/api/account/wishlist").then(async (response) => { if (response.ok) replaceWishlist((await response.json()).productIds); }).catch(() => undefined);
  }, [replaceWishlist]);

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur border-b border-ink-300/30">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-900 text-gold-400">
            <Gem size={18} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl tracking-wide text-maroon-900">
              SRA
            </span>
            <span className="block text-[9px] tracking-[0.3em] text-gold-600">
              JEWELLERS
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium pb-1 border-b-2 transition-colors",
                  active
                    ? "text-maroon-900 border-gold-500"
                    : "text-ink-700 border-transparent hover:text-maroon-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 text-ink-700 hover:text-maroon-800 hover:bg-cream-300 rounded-full"
          >
            <Search size={19} />
          </button>
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${mounted ? wishlistCount : 0} items`}
            className="relative p-2 text-ink-700 hover:text-maroon-800 hover:bg-cream-300 rounded-full hidden sm:inline-flex"
          >
            <Heart size={19} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon-800 text-[9px] text-cream-100">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="p-2 text-ink-700 hover:text-maroon-800 hover:bg-cream-300 rounded-full hidden sm:inline-flex"
          >
            <User size={19} />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${mounted ? cartCount : 0} items`}
            className="relative p-2 text-ink-700 hover:text-maroon-800 hover:bg-cream-300 rounded-full"
          >
            <ShoppingBag size={19} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] text-maroon-950">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="p-2 text-ink-700 hover:text-maroon-800 hover:bg-cream-300 rounded-full lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-300/30 bg-cream-100"
          >
            <div className="container-page py-4">
              <SearchBar autoFocus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
