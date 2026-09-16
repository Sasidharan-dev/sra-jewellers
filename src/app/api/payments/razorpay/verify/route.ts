import crypto from "node:crypto";
import { currentUser } from "@/lib/server/auth";
import { findOrder, updateStoredOrder } from "@/lib/server/db";
import { jsonError } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !process.env.RAZORPAY_KEY_SECRET) throw new Error("Payment verification unavailable");
    const body = await request.json();
    const order = await findOrder(String(body.internalOrderId || ""));
    if (!order || (order.userId && order.userId !== user.id)) throw new Error("Order not found");
    if (order.razorpayOrderId !== body.razorpay_order_id) throw new Error("Payment order mismatch");
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(body.razorpay_signature || "")))) throw new Error("Invalid payment signature");
    const updated = await updateStoredOrder(order.orderId, { paymentStatus: "paid", razorpayPaymentId: String(body.razorpay_payment_id) });
    return Response.json({ verified: true, order: updated });
  } catch (error) { return jsonError(error, 400); }
}
