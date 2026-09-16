import { consumePasswordReset, updateUser } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";
import { jsonError, requiredString } from "@/lib/server/validation";

export async function POST(request: Request) {
  try { const body = await request.json(); const token = requiredString(body.token, "Reset token", 100); const password = requiredString(body.password, "Password", 100); if (password.length < 8) throw new Error("Password must be at least 8 characters"); const reset = await consumePasswordReset(token); if (!reset) return Response.json({ error: "Reset token is invalid or expired" }, { status: 400 }); await updateUser(reset.userId, { passwordHash: hashPassword(password) }); return Response.json({ message: "Password updated successfully" }); } catch (error) { return jsonError(error); }
}
