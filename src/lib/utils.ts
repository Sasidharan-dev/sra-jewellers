import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateOrderId(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `SRA-2026-${rand}`;
}

export function generateDesignRequestId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SDR-2026-${rand}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
