import { currentUser } from "@/lib/server/auth";
import { updateStoredOrder } from "@/lib/server/db";
import { sendNotification } from "@/lib/server/notifications";
import { jsonError } from "@/lib/server/validation";

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required");
    const { orderId } = await context.params;
    const body = await request.json();
    const currentStepIndex = Number(body.currentStepIndex);
    if (!Number.isInteger(currentStepIndex) || currentStepIndex < 0 || currentStepIndex > 6) throw new Error("Invalid order status");
    const order = await updateStoredOrder(orderId, { currentStepIndex, paymentStatus: body.paymentStatus });
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
    const status = ["Order Placed", "Order Confirmed", "Payment Confirmed", "Jewellery in Making", "Quality Check", "Ready for Delivery", "Delivered"][currentStepIndex];
    await sendNotification(order.email, `Order ${order.orderId} status updated`, `Your order is now: ${status}.`, "order-status");
    await sendNotification(order.phone, `Order ${order.orderId} status updated`, `Your order is now: ${status}.`, "whatsapp");
    return Response.json({ order });
  } catch (error) { return jsonError(error, 403); }
}
