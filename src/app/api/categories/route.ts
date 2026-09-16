import { categories } from "@/data/categories";
export async function GET() { return Response.json({ categories }); }
