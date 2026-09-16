import { subscribeNewsletter } from "@/lib/server/db";
import { emailString, jsonError } from "@/lib/server/validation";
export async function POST(request: Request) {
  try { const { email } = await request.json(); await subscribeNewsletter(emailString(email)); return Response.json({ message: "Subscribed successfully" }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
