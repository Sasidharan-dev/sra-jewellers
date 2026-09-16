import { randomBytes } from "node:crypto";
import { createPasswordReset, findUserByEmail } from "@/lib/server/db";
import { emailString, jsonError } from "@/lib/server/validation";

export async function POST(request: Request) {
  try { const email = emailString((await request.json()).email); const user = await findUserByEmail(email); if (!user) return Response.json({ message: "If an account exists, reset instructions are ready." }); const token = randomBytes(24).toString("hex"); await createPasswordReset(user.id, token, new Date(Date.now() + 15 * 60 * 1000).toISOString()); return Response.json({ message: "Reset link created for local development.", resetToken: token }); } catch (error) { return jsonError(error); }
}
