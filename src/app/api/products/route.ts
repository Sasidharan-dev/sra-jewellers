import { listCatalog } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search")?.toLowerCase();
  const catalog = await listCatalog();
  const result = catalog.filter((product) =>
    (!category || product.category.toLowerCase() === category.toLowerCase()) &&
    (!search || `${product.name} ${product.category} ${product.jewelleryType}`.toLowerCase().includes(search))
  );
  return Response.json({ products: result, total: result.length });
}
