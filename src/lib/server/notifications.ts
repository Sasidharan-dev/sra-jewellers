import { queueNotification } from "@/lib/server/db";

export async function sendNotification(recipient: string, subject: string, body: string, type = "email") {
  const notification = await queueNotification({ type, recipient, subject, body });
  try {
    if (type === "email" || type === "order-confirmation" || type === "order-status") {
      if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
        await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [recipient], subject, html: `<p>${body.replace(/\n/g, "<br />")}</p>` }) });
      }
    }
    if (type === "whatsapp" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const form = new URLSearchParams({ From: process.env.TWILIO_WHATSAPP_FROM, To: `whatsapp:${recipient.replace(/^whatsapp:/, "")}`, Body: `${subject}\n\n${body}` });
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    }
  } catch { /* Keep local queue available when a provider is not configured or unavailable. */ }
  return notification;
}
