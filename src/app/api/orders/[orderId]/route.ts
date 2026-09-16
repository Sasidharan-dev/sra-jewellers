import { findOrder } from "@/lib/server/db";

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const order = await findOrder(orderId.trim());
  return order ? Response.json({ order }) : Response.json({ error: "Order not found" }, { status: 404 });
}
