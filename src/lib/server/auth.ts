import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createSession, deleteSession, getUserBySession } from "@/lib/server/db";

const cookieName = "sra_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  await createSession(userId, token, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: new Date(expiresAt) });
}

export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  return token ? getUserBySession(token) : undefined;
}

export async function endSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (token) await deleteSession(token);
  cookieStore.delete(cookieName);
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("Authentication required");
  return user;
}

export function publicUser(user: { id: string; name: string; email: string; phone: string; role: string; address?: unknown }) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: user.address ?? null };
}
