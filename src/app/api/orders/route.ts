import { products } from "@/data/products";
import { createOrder, updateUser } from "@/lib/server/db";
import { sendNotification } from "@/lib/server/notifications";
import { currentUser } from "@/lib/server/auth";
import { emailString, jsonError, requiredString } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await currentUser();
    const customerName = requiredString(body.customerName, "Full name", 120);
    const phone = requiredString(body.phone, "Phone", 30);
    const email = emailString(body.email);
    const address = {
      address: requiredString(body.address?.address, "Address", 300),
      city: requiredString(body.address?.city, "City", 80),
      state: requiredString(body.address?.state, "State", 80),
      pincode: requiredString(body.address?.pincode, "Pincode", 10),
      country: requiredString(body.address?.country || "India", "Country", 80),
    };
    if (user) await updateUser(user.id, { name: customerName, phone, address });
    const paymentMethod = body.paymentMethod;
    if (!["upi", "card", "cod"].includes(paymentMethod)) throw new Error("Invalid payment method");
    if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("Cart is empty");

    const items = body.items.map((line: { productId?: unknown; quantity?: unknown; size?: unknown }) => {
      const product = products.find((item) => item.id === line.productId);
      const quantity = Number(line.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Invalid cart item");
      return { productId: product.id, name: product.name, quantity, price: product.price, size: typeof line.size === "string" ? line.size : undefined };
    });
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const makingCharges = items.reduce((sum: number, item: { productId: string; quantity: number }) => sum + (products.find((p) => p.id === item.productId)?.makingCharge ?? 0) * item.quantity, 0);
    const tax = Math.round((subtotal + makingCharges) * 0.03);
    const created = await createOrder({ userId: user?.id, customerName, phone, email, address, paymentMethod, paymentStatus: paymentMethod === "cod" ? "cod" : "pending", orderDate: new Date().toISOString(), estimatedDelivery: "5–9 business days", currentStepIndex: paymentMethod === "cod" ? 1 : 0, items, subtotal, makingCharges, tax, total: subtotal + makingCharges + tax });
    await sendNotification(email, `SRA Jewellers order ${created.orderId}`, `Your order ${created.orderId} has been received.`, "order-confirmation");
    await sendNotification(phone, `SRA Jewellers order ${created.orderId}`, `Your order ${created.orderId} has been received. Total: ₹${created.total.toLocaleString("en-IN")}.`, "whatsapp");
    return Response.json({ order: created }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
