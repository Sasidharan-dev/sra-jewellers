import { randomUUID } from "node:crypto";
import { listCatalog, createCatalogProduct } from "@/lib/server/db";
import { currentUser } from "@/lib/server/auth";
import { jsonError, requiredString } from "@/lib/server/validation";

async function admin() { const user = await currentUser(); if (!user || user.role !== "ADMIN") throw new Error("Admin access required"); }
export async function GET() { try { await admin(); return Response.json({ products: await listCatalog() }); } catch (error) { return jsonError(error, 403); } }
export async function POST(request: Request) {
  try {
    await admin(); const body = await request.json();
    const name = requiredString(body.name, "Product name", 160); const slug = requiredString(body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "Slug", 180);
    const product = await createCatalogProduct({ id: `SRA-${randomUUID().slice(0, 6).toUpperCase()}`, slug, name, category: body.category || "Rings", jewelleryType: body.jewelleryType || "Jewellery", goldPurity: body.goldPurity || "22K", weightGrams: Number(body.weightGrams) || 0, price: Number(body.price) || 0, makingCharge: Number(body.makingCharge) || 0, inStock: body.inStock !== false, description: String(body.description || "").trim(), image: String(body.image || "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80"), gallery: [], flags: [], rating: 0, reviewCount: 0 });
    return Response.json({ product }, { status: 201 });
  } catch (error) { return jsonError(error, error instanceof Error && error.message === "Admin access required" ? 403 : 400); }
}
