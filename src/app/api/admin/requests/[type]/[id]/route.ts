import { currentUser } from "@/lib/server/auth";
import { updateRequestStatus } from "@/lib/server/db";
import { jsonError } from "@/lib/server/validation";

export async function PATCH(request: Request, context: { params: Promise<{ type: string; id: string }> }) {
  try {
    const user = await currentUser(); if (!user || user.role !== "ADMIN") throw new Error("Admin access required");
    const { type, id } = await context.params; if (type !== "contact" && type !== "design") throw new Error("Invalid request type");
    const { status } = await request.json(); if (!["NEW", "IN_PROGRESS", "RESOLVED", "REJECTED"].includes(status)) throw new Error("Invalid request status");
    await updateRequestStatus(type, id, status); return Response.json({ success: true });
  } catch (error) { return jsonError(error, 403); }
}
