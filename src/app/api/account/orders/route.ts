import { listOrders } from "@/lib/server/db";
import { currentUser } from "@/lib/server/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const orders = (await listOrders()).filter((order) => order.userId === user.id || order.email === user.email);
  return Response.json({ orders });
}
