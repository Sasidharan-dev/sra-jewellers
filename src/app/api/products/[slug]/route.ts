import { listCatalog } from "@/lib/server/db";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = (await listCatalog()).find((item) => item.slug === slug || item.id === slug);
  return product ? Response.json({ product }) : Response.json({ error: "Product not found" }, { status: 404 });
}
