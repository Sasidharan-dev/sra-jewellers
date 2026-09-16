import { currentUser } from "@/lib/server/auth";
import { findOrder, updateStoredOrder } from "@/lib/server/db";
import { jsonError } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Login required");
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error("Razorpay is not configured. Add Razorpay keys to .env.local.");
    const body = await request.json();
    const internalOrderId = String(body.internalOrderId || "");
    const order = await findOrder(internalOrderId);
    if (!order || (order.userId && order.userId !== user.id)) throw new Error("Order not found");
    const amount = Number(body.amount);
    if (!Number.isInteger(amount) || amount !== order.total * 100) throw new Error("Invalid payment amount");
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount, currency: "INR", receipt: internalOrderId, notes: { internalOrderId, customerEmail: order.email } }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.description || "Could not create Razorpay order");
    await updateStoredOrder(internalOrderId, { razorpayOrderId: result.id });
    return Response.json({ keyId: process.env.RAZORPAY_KEY_ID, razorpayOrderId: result.id, amount: result.amount, currency: result.currency });
  } catch (error) { return jsonError(error); }
}
