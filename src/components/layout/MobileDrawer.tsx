"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Custom Design", href: "/custom-design" },
  { label: "Track Order", href: "/track-order" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] md:hidden" initial={false}>
          <motion.div
            className="absolute inset-0 bg-maroon-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-cream-100 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl text-maroon-900">
                SRA Jewellers
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 text-ink-700 hover:bg-cream-300 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 border-b border-ink-300/30 text-ink-900 hover:text-maroon-800"
                >
                  {link.label}
                  <ChevronRight size={16} className="text-ink-500" />
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6 text-xs text-ink-500">
              <p>Need help? Call +91 98765 43210</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
