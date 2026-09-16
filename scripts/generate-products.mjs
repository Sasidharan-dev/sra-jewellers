import fs from "fs";

const rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// Curated, verified real jewellery photos from Unsplash (stable CDN URLs,
// free commercial-use license). Picked per category so images always match
// the product type — no keyword-guessing placeholder services involved.
// TODO(backend): replace these arrays with real SRA Jewellers product photos.
const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const categoryImages = {
  Rings: [
    "1622398925373-3f91b1e275f5",
    "1598560917807-1bae44bd2be8",
    "1631982690223-8aa4be0a2497",
    "1611955167811-4711904bb9f8",
    "1631982686092-e6561a853187",
    "1705326455036-0fab8ecba04d",
    "1543294001-f7cd5d7fb516",
    "1674465992629-f8f81a8fb6d9",
  ],
  Earrings: [
    "1758995115682-1452a1a9e35b",
    "1653227907864-560dce4c252d",
    "1701777892740-88419a701472",
    "1705326454933-9685fc6888e1",
    "1708220040828-9ab1673681d3",
    "1671644730555-916aa8d8157f",
    "1654781456542-fdd1683c79c3",
    "1603974372039-adc49044b6bd",
  ],
  Necklaces: [
    "1611107683227-e9060eccd846",
    "1721103418312-b0057a8c31c2",
    "1705326454924-f6777522b030",
    "1705326452390-3ecf6070595f",
    "1601121141461-9d6647bca1ed",
    "1600862754152-80a263dd564f",
    "1685970731194-e27b477e87ba",
  ],
  Chains: [
    "1640183297213-863406155597",
    "1659708701940-e60893ef03d0",
    "1649118488759-3d49c09ad106",
    "1705326453292-f3d35cd96514",
    "1780566760072-4319cdc6d671",
    "1669462411069-1c3a1e7fcadf",
    "1598011077297-9d340d222163",
  ],
  Bangles: [
    "1758995116383-f51775896add",
    "1768359666502-306694fa6fcf",
    "1679156271456-d6068c543ee7",
    "1728381031272-ba3f537feadd",
    "1690175867343-2af70ea57537",
    "1741071520904-37ef3c0fea09",
  ],
  Bracelets: [
    "1679156272446-30738eb5c4e7",
    "1741071520895-47d81779c11e",
    "1611598935678-c88dca238fce",
    "1617191880362-aac615de3c26",
    "1626784215013-13322cb0e471",
  ],
  Pendants: [
    "1761211106346-939cb32005d7",
    "1595002032946-65355a3acabb",
    "1605201206717-cb9eca0d2eb2",
    "1569397288884-4d43d6738fbd",
  ],
  "Bridal Jewellery": [
    "1685970731194-e27b477e87ba",
    "1721103418312-b0057a8c31c2",
    "1722410180687-b05b50922362",
    "1742891603547-950f510710d7",
    "1758995115682-1452a1a9e35b",
  ],
};

const categories = [
  {
    name: "Rings",
    tag: "gold-ring,jewellery-ring",
    type: "Ring",
    weightRange: [2, 9],
    priceMultiplier: 6400,
    names: [
      "Classic Gold Band Ring",
      "Solitaire Halo Ring",
      "Nakshi Work Cocktail Ring",
      "Minimal Everyday Stack Ring",
      "Ruby Halo Engagement Ring",
      "Antique Peacock Motif Ring",
      "Emerald Cluster Statement Ring",
      "Twin Heart Promise Ring",
    ],
  },
  {
    name: "Earrings",
    tag: "gold-earrings,jhumka-earrings",
    type: "Earrings",
    weightRange: [1.5, 8],
    priceMultiplier: 6200,
    names: [
      "Elegant Ruby Stud Earrings",
      "Antique Peacock Jhumka",
      "Classic Gold Hoop Earrings",
      "Kundan Chandbali Earrings",
      "Pearl Drop Danglers",
      "Temple Lakshmi Jhumka",
      "Modern Geometric Studs",
      "Floral Filigree Earrings",
    ],
  },
  {
    name: "Necklaces",
    tag: "gold-necklace,indian-necklace",
    type: "Necklace",
    weightRange: [8, 30],
    priceMultiplier: 6000,
    names: [
      "Classic Lakshmi Gold Necklace",
      "Traditional Temple Haram",
      "Kundan Choker Necklace",
      "Antique Mango Mala",
      "Floral Vine Gold Necklace",
      "Ruby Studded Layered Necklace",
      "Modern Minimal Gold Necklace",
    ],
  },
  {
    name: "Chains",
    tag: "gold-chain,mens-gold-chain",
    type: "Chain",
    weightRange: [3, 20],
    priceMultiplier: 6100,
    names: [
      "Daily Wear Singapore Chain",
      "Classic Rope Gold Chain",
      "Figaro Link Gold Chain",
      "Fine Box Chain",
      "Men's Curb Link Chain",
      "Kids Delicate Gold Chain",
      "Byzantine Gold Chain",
    ],
  },
  {
    name: "Bangles",
    tag: "gold-bangles,indian-bangles",
    type: "Bangle",
    weightRange: [10, 40],
    priceMultiplier: 6300,
    names: [
      "Royal Nakshi Bangle",
      "Classic Plain Gold Bangle",
      "Antique Temple Bangle Set",
      "Diamond Cut Bangle",
      "Meenakari Enamel Bangle",
      "Bridal Kada Bangle",
    ],
  },
  {
    name: "Bracelets",
    tag: "gold-bracelet,charm-bracelet",
    type: "Bracelet",
    weightRange: [4, 14],
    priceMultiplier: 6200,
    names: [
      "Floral Gold Bracelet",
      "Tennis Style Gold Bracelet",
      "Beaded Gold Charm Bracelet",
      "Men's Curb Gold Bracelet",
      "Delicate Chain Link Bracelet",
    ],
  },
  {
    name: "Pendants",
    tag: "gold-pendant,lakshmi-pendant",
    type: "Pendant",
    weightRange: [2, 8],
    priceMultiplier: 6500,
    names: [
      "Lakshmi Pendant",
      "Om Symbol Gold Pendant",
      "Ganesha Blessing Pendant",
      "Initial Letter Gold Pendant",
    ],
  },
  {
    name: "Bridal Jewellery",
    tag: "bridal-jewellery,kundan-bridal-set",
    type: "Bridal Set",
    weightRange: [25, 55],
    priceMultiplier: 6600,
    names: [
      "Bridal Kundan Necklace Set",
      "Royal Polki Bridal Set",
      "Temple Antique Bridal Haram",
      "Rani Haar Bridal Set",
      "Meenakari Bridal Choker Set",
    ],
  },
];

const purities = ["18K", "22K", "24K"];
const flagsPool = ["Bestseller", "New Arrival", "Featured"];

const stoneOptions = [
  "Ruby and polki stone work",
  "Kundan and green enamel detailing",
  "Cubic zirconia studded finish",
  "Uncut diamond (polki) accents",
  "Pearl drop detailing",
  "No stone — plain gold finish",
  "Emerald and ruby combination stones",
  "Antique temple carving, no stones",
];

let idCounter = 1;
const products = [];
const random = rng(42);

for (const cat of categories) {
  cat.names.forEach((name, idx) => {
    const id = `SRA-${String(idCounter).padStart(3, "0")}`;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const purity = purities[Math.floor(random() * purities.length)];
    const weight = +(
      cat.weightRange[0] +
      random() * (cat.weightRange[1] - cat.weightRange[0])
    ).toFixed(1);
    const purityMultiplier = purity === "24K" ? 1.15 : purity === "22K" ? 1 : 0.82;
    const price = Math.round(
      (weight * cat.priceMultiplier * purityMultiplier + idx * 1200) / 10
    ) * 10;
    const makingCharge = Math.round((price * (0.08 + random() * 0.06)) / 10) * 10;
    const inStock = random() > 0.08;
    const numFlags = Math.floor(random() * 2) + (idx < 2 ? 1 : 0);
    const flags = [];
    const shuffledFlags = [...flagsPool].sort(() => random() - 0.5);
    for (let i = 0; i < Math.min(numFlags, 2); i++) flags.push(shuffledFlags[i]);
    const pool = categoryImages[cat.name];
    const mainId = pool[idx % pool.length];
    const image = UNSPLASH(mainId);
    // Gallery reuses the category's curated set (offset) so every shot is a
    // real, verified jewellery photo rather than a random placeholder.
    const gallery = [0, 1, 2].map((offset) => {
      const id = pool[(idx + offset + 1) % pool.length];
      return UNSPLASH(id);
    });

    products.push({
      id,
      slug,
      name,
      category: cat.name,
      jewelleryType: cat.type,
      goldPurity: purity,
      weightGrams: weight,
      price,
      makingCharge,
      inStock,
      description: `${name} crafted in ${purity} gold, weighing approximately ${weight}g. A ${cat.type.toLowerCase()} designed for those who value timeless craftsmanship, finished by SRA Jewellers' in-house artisans with meticulous hand-finishing and a certified hallmark.`,
      careInfo:
        "Store separately in a soft pouch, avoid contact with perfumes and chemicals, and get it professionally polished once a year.",
      stoneDetails: stoneOptions[Math.floor(random() * stoneOptions.length)],
      sizes:
        cat.name === "Rings" || cat.name === "Bangles"
          ? ["10", "12", "14", "16", "18"]
          : undefined,
      image,
      gallery,
      flags,
      rating: +(3.9 + random() * 1.1).toFixed(1),
      reviewCount: Math.floor(8 + random() * 180),
    });
    idCounter++;
  });
}

const header = `// AUTO-GENERATED MOCK DATA — DO NOT EDIT BY HAND.
// TODO(backend): Replace this file's contents with a fetch from the real
// product catalogue API, e.g. GET /api/products. Keep the \`Product\` shape
// (see src/types/index.ts) so downstream components require no changes.
import { Product } from "@/types";

export const products: Product[] = `;

const footer = `\n;\n`;

fs.writeFileSync(
  new URL("../src/data/products.ts", import.meta.url),
  header + JSON.stringify(products, null, 2) + footer
);

console.log(`Generated ${products.length} products`);
