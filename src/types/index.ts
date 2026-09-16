export type JewelleryCategory =
  | "Rings"
  | "Earrings"
  | "Necklaces"
  | "Chains"
  | "Bangles"
  | "Bracelets"
  | "Pendants"
  | "Bridal Jewellery"
  | "Kids Jewellery";

export type GoldPurity = "18K" | "22K" | "24K";

export type ProductFlag = "Bestseller" | "New Arrival" | "Featured";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: JewelleryCategory;
  jewelleryType: string;
  goldPurity: GoldPurity;
  weightGrams: number;
  price: number;
  makingCharge: number;
  inStock: boolean;
  description: string;
  careInfo?: string;
  stoneDetails?: string;
  sizes?: string[];
  image: string;
  gallery: string[];
  flags: ProductFlag[];
  rating: number;
  reviewCount: number;
}

export interface CategoryInfo {
  id: string;
  name: JewelleryCategory;
  slug: string;
  image: string;
  description: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  tagline: string;
}

export interface GoldRate {
  purity: GoldPurity;
  ratePerGram: number;
}

export interface GoldRateSnapshot {
  updatedAt: string;
  city: string;
  rates: GoldRate[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export type OrderStatusStep =
  | "Order Placed"
  | "Order Confirmed"
  | "Payment Confirmed"
  | "Jewellery in Making"
  | "Quality Check"
  | "Ready for Delivery"
  | "Delivered";

export interface MockOrder {
  orderId: string;
  customerName: string;
  orderDate: string;
  estimatedDelivery: string;
  currentStepIndex: number;
  items: { productId: string; name: string; quantity: number; price: number; size?: string }[];
  total: number;
}

export interface CustomDesignRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  jewelleryType: string;
  goldPurity: GoldPurity;
  approxWeight: string;
  budget: string;
  description: string;
  fileName?: string;
  createdAt: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
  size?: string;
}
