import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { saveDesignRequest } from "@/lib/server/db";
import { emailString, jsonError, requiredString } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const id = `SDR-${new Date().getFullYear()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    const file = form.get("file");
    let fileName: string | undefined;
    if (file instanceof File && file.size > 0) {
      if (file.size > 8 * 1024 * 1024) throw new Error("File must be smaller than 8MB");
      if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) throw new Error("Only JPG, PNG, WEBP, or PDF files are allowed");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const uploadDir = process.env.VERCEL ? path.join("/tmp", "sra-jewellers", "uploads") : path.join(process.cwd(), "data", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, `${id}-${safeName}`), Buffer.from(await file.arrayBuffer()));
      fileName = safeName;
    }
    const requestData = { id, fullName: requiredString(form.get("fullName"), "Full name", 120), phone: requiredString(form.get("phone"), "Phone", 30), email: emailString(form.get("email")), jewelleryType: requiredString(form.get("jewelleryType"), "Jewellery type", 50), goldPurity: requiredString(form.get("goldPurity"), "Gold purity", 3), approxWeight: String(form.get("approxWeight") ?? "").trim(), budget: String(form.get("budget") ?? "").trim(), description: requiredString(form.get("description"), "Description", 3000), fileName, createdAt: new Date().toISOString() };
    await saveDesignRequest(requestData);
    return Response.json({ request: requestData }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
