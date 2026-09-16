import { currentUser } from "@/lib/server/auth";
import { getWishlist, setWishlist } from "@/lib/server/db";

export async function GET() { const user = await currentUser(); if (!user) return Response.json({ error: "Authentication required" }, { status: 401 }); return Response.json({ productIds: await getWishlist(user.id) }); }
export async function PUT(request: Request) { const user = await currentUser(); if (!user) return Response.json({ error: "Authentication required" }, { status: 401 }); const body = await request.json(); if (!Array.isArray(body.productIds)) return Response.json({ error: "Invalid wishlist" }, { status: 400 }); return Response.json({ productIds: await setWishlist(user.id, body.productIds.filter((id: unknown): id is string => typeof id === "string")) }); }
