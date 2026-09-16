import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoldRateWidget } from "@/components/gold/GoldRateWidget";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "SRA Jewellers — Crafted to Perfection, Delivered with Trust",
  description:
    "Premium hallmarked gold jewellery — rings, necklaces, chains, bangles, bridal sets and custom designs from SRA Jewellers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Loaded progressively at runtime; layout already has solid serif/sans fallbacks if offline. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoldRateWidget />
        <ToastContainer />
      </body>
    </html>
  );
}
