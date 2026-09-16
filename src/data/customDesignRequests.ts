// TODO(backend): Replace with GET /api/custom-design-requests (admin-side)
// and POST /api/custom-design-requests (customer submission, multipart/form-data
// with the actual uploaded file). See src/lib/store/customDesignStore.ts for
// the client-side store that holds requests submitted during this session.
import { CustomDesignRequest } from "@/types";

export const sampleCustomDesignRequests: CustomDesignRequest[] = [
  {
    id: "SDR-2026-4821",
    fullName: "Arun Kumar",
    phone: "+91 98765 12340",
    email: "arun.kumar@example.com",
    jewelleryType: "Pendant",
    goldPurity: "22K",
    approxWeight: "6-8 grams",
    budget: "₹35,000 - ₹45,000",
    description:
      "Looking for a custom Ganesha pendant based on a family heirloom design, with slightly more detailing on the trunk and ears. Reference photo attached.",
    fileName: "ganesha-pendant-reference.jpg",
    createdAt: "2026-08-12T10:15:00+05:30",
  },
  {
    id: "SDR-2026-4802",
    fullName: "Divya Sundaram",
    phone: "+91 98765 55210",
    email: "divya.sundaram@example.com",
    jewelleryType: "Ring",
    goldPurity: "18K",
    approxWeight: "4-5 grams",
    budget: "₹40,000 - ₹55,000",
    description:
      "Want an engagement ring inspired by a minimal solitaire design I found online, but with a thinner band and a halo of small stones instead of a plain band.",
    fileName: "ring-inspiration.png",
    createdAt: "2026-08-05T16:42:00+05:30",
  },
  {
    id: "SDR-2026-4779",
    fullName: "Priya Ramaswamy",
    phone: "+91 98765 90871",
    email: "priya.ramaswamy@example.com",
    jewelleryType: "Necklace",
    goldPurity: "22K",
    approxWeight: "25-30 grams",
    budget: "₹1,50,000 - ₹2,00,000",
    description:
      "Bridal necklace combining temple-style motifs with a modern layered look, similar to a design I've sketched and attached as a PDF.",
    fileName: "bridal-necklace-sketch.pdf",
    createdAt: "2026-07-28T09:05:00+05:30",
  },
];
