// TODO(backend): Replace with GET /api/testimonials
import { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Ramaswamy",
    location: "Coimbatore",
    rating: 5,
    quote:
      "The bridal set I ordered was even more beautiful in person. The hallmark certification and packaging felt genuinely premium.",
  },
  {
    id: "t2",
    name: "Arun Kumar",
    location: "Chennai",
    rating: 5,
    quote:
      "I sent a rough sketch through the custom design page and SRA turned it into a real pendant. The whole process was transparent.",
  },
  {
    id: "t3",
    name: "Divya Sundaram",
    location: "Salem",
    rating: 4,
    quote:
      "Loved how easy it was to track my order online — got updates at every stage from crafting to delivery.",
  },
  {
    id: "t4",
    name: "Karthik Iyer",
    location: "Madurai",
    rating: 5,
    quote:
      "Bought a daily-wear chain for my mother. Lightweight, well-finished, and the pricing breakdown was completely clear upfront.",
  },
];
