import { listContacts, listDesignRequests, listOrders, listUsers } from "@/lib/server/db";
import { currentUser } from "@/lib/server/auth";

export async function GET() {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") return Response.json({ error: "Admin access required" }, { status: 403 });
  const [orders, contacts, designRequests, users] = await Promise.all([listOrders(), listContacts(), listDesignRequests(), listUsers()]);
  return Response.json({ stats: { orders: orders.length, contacts: contacts.length, designRequests: designRequests.length, users: users.length, revenue: orders.reduce((sum, order) => sum + order.total, 0) }, orders, contacts, designRequests, users });
}
