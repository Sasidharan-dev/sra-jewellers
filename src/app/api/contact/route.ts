import { saveContact } from "@/lib/server/db";
import { sendNotification } from "@/lib/server/notifications";
import { emailString, jsonError, requiredString } from "@/lib/server/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await saveContact({ name: requiredString(body.name, "Name", 120), phone: requiredString(body.phone, "Phone", 30), email: emailString(body.email), message: requiredString(body.message, "Message", 2000) });
    await sendNotification(message.email, "SRA Jewellers received your message", "Our team will get back to you shortly.", "contact-confirmation");
    return Response.json({ message: "Your message was received", id: message.id }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
