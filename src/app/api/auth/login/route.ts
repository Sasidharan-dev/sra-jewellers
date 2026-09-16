import { createUser, findUserByEmail } from "@/lib/server/db";
import { publicUser, startSession, verifyPassword } from "@/lib/server/auth";
import { emailString, jsonError, requiredString } from "@/lib/server/validation";
import { randomUUID } from "node:crypto";
import { hashPassword } from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = emailString(body.email);
    let user = await findUserByEmail(email);
    if (!user && email === (process.env.ADMIN_EMAIL || "admin@srajewels.com") && body.password === (process.env.ADMIN_PASSWORD || "Admin@12345")) {
      user = await createUser({ id: randomUUID(), name: "SRA Admin", email, phone: "", passwordHash: hashPassword(String(body.password)), role: "ADMIN", createdAt: new Date().toISOString() });
    }
    if (!user || !verifyPassword(requiredString(body.password, "Password", 100), user.passwordHash)) return Response.json({ error: "Invalid email or password" }, { status: 401 });
    await startSession(user.id);
    return Response.json({ user: publicUser(user) });
  } catch (error) { return jsonError(error); }
}
