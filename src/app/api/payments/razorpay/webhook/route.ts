import crypto from "node:crypto";
import { findOrder, updateStoredOrder } from "@/lib/server/db";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return Response.json({ error: "Webhook secret is not configured" }, { status: 503 });
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
  if (expected !== signature) return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  const event = JSON.parse(rawBody) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  const razorpayOrderId = event.payload?.payment?.entity?.order_id;
  if (razorpayOrderId && ["payment.captured", "order.paid"].includes(event.event || "")) {
    const orders = await import("@/lib/server/db").then((db) => db.listOrders());
    const order = orders.find((item) => item.razorpayOrderId === razorpayOrderId);
    if (order) await updateStoredOrder(order.orderId, { paymentStatus: "paid", razorpayPaymentId: event.payload?.payment?.entity?.id });
  }
  return Response.json({ received: true });
}
