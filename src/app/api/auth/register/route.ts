import { randomUUID } from "node:crypto";
import { createUser, findUserByEmail } from "@/lib/server/db";
import { hashPassword, publicUser, startSession } from "@/lib/server/auth";
import { emailString, jsonError, requiredString } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = requiredString(body.name, "Name", 120);
    const email = emailString(body.email);
    if (email === (process.env.ADMIN_EMAIL || "admin@srajewels.com")) return Response.json({ error: "This is the admin account. Please sign in." }, { status: 403 });
    const password = requiredString(body.password, "Password", 100);
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    if (await findUserByEmail(email)) return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    const user = await createUser({ id: randomUUID(), name, email, phone: String(body.phone ?? "").trim(), passwordHash: hashPassword(password), role: "CUSTOMER", createdAt: new Date().toISOString() });
    await startSession(user.id);
    return Response.json({ user: publicUser(user) }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
