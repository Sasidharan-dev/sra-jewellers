import { currentUser } from "@/lib/server/auth";
import { deleteCatalogProduct, updateCatalogProduct } from "@/lib/server/db";
import { jsonError } from "@/lib/server/validation";
async function admin() { const user = await currentUser(); if (!user || user.role !== "ADMIN") throw new Error("Admin access required"); }
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { try { await admin(); const { id } = await context.params; const body = await request.json(); const product = await updateCatalogProduct(id, body); return product ? Response.json({ product }) : Response.json({ error: "Product not found" }, { status: 404 }); } catch (error) { return jsonError(error, 403); } }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { try { await admin(); const { id } = await context.params; await deleteCatalogProduct(id); return Response.json({ success: true }); } catch (error) { return jsonError(error, 403); } }
