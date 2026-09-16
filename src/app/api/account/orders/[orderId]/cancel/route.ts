import { currentUser } from "@/lib/server/auth";
import { findOrder, updateStoredOrder } from "@/lib/server/db";

export async function POST(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const user = await currentUser(); if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const { orderId } = await context.params; const order = await findOrder(orderId);
  if (!order || (order.userId !== user.id && order.email !== user.email)) return Response.json({ error: "Order not found" }, { status: 404 });
  if (order.currentStepIndex >= 3) return Response.json({ error: "This order can no longer be cancelled" }, { status: 400 });
  const updated = await updateStoredOrder(orderId, { currentStepIndex: 0, paymentStatus: "pending", estimatedDelivery: "Cancellation requested" });
  return Response.json({ order: updated, message: "Cancellation request sent to SRA Jewellers" });
}
