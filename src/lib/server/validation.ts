export function requiredString(value: unknown, field: string, max = 500) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  if (value.length > max) throw new Error(`${field} is too long`);
  return value.trim();
}

export function emailString(value: unknown) {
  const email = requiredString(value, "Email", 160).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address");
  return email;
}

export function jsonError(error: unknown, status = 400) {
  return Response.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status });
}
