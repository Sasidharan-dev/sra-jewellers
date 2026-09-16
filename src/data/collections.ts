// TODO(backend): Replace with GET /api/collections
import { Collection } from "@/types";

export const collections: Collection[] = [
  {
    id: "col-bridal",
    name: "Bridal Collection",
    slug: "bridal-collection",
    tagline: "For the once-in-a-lifetime day",
    image: "https://images.unsplash.com/photo-1742891603547-950f510710d7?auto=format&fit=crop&w=900&q=80",
    description:
      "Elaborate kundan, polki and temple-inspired sets designed for brides who want heirloom-quality craftsmanship.",
  },
  {
    id: "col-everyday",
    name: "Everyday Gold",
    slug: "everyday-gold",
    tagline: "Light enough to wear daily",
    image: "https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight chains, studs and bangles built for comfort without compromising on shine.",
  },
  {
    id: "col-festive",
    name: "Festive Collection",
    slug: "festive-collection",
    tagline: "Statement pieces for celebrations",
    image: "https://images.unsplash.com/photo-1685970731194-e27b477e87ba?auto=format&fit=crop&w=900&q=80",
    description:
      "Bold necklaces, jhumkas and bangles designed to stand out at every festival and family occasion.",
  },
  {
    id: "col-diamond",
    name: "Diamond Collection",
    slug: "diamond-collection",
    tagline: "Brilliance, set in gold",
    image: "https://images.unsplash.com/photo-1631982686092-e6561a853187?auto=format&fit=crop&w=900&q=80",
    description:
      "Certified diamonds set in 18K gold for engagement rings, studs and pendants.",
  },
  {
    id: "col-traditional",
    name: "Traditional Collection",
    slug: "traditional-collection",
    tagline: "Temple craftsmanship, reimagined",
    image: "https://images.unsplash.com/photo-1758995116383-f51775896add?auto=format&fit=crop&w=900&q=80",
    description:
      "Antique temple motifs — Lakshmi, peacock and mango — carried forward in modern proportions.",
  },
  {
    id: "col-modern",
    name: "Modern Collection",
    slug: "modern-collection",
    tagline: "Clean lines, contemporary spirit",
    image: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=900&q=80",
    description:
      "Geometric and minimal silhouettes for those who prefer understated luxury.",
  },
];
