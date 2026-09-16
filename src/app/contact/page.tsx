"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useToastStore } from "@/lib/store/toastStore";

// TODO(backend): replace with real business info once available.
const CONTACT_INFO = {
  brand: "SRA Jewellers",
  phone: "+91 98765 43210",
  email: "support@srajewels.com",
  address: "123, Gold Street, Coimbatore, Tamil Nadu, India",
  hours: "Mon – Sat: 10:00 AM – 8:30 PM · Sun: 11:00 AM – 6:00 PM",
};

export default function ContactPage() {
  const showToast = useToastStore((s) => s.show);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), phone: form.get("phone"), email: form.get("email"), message: form.get("message") }) });
    const result = await response.json();
    if (!response.ok) { showToast(result.error || "Could not send message"); return; }
    showToast("Message sent — our team will get back to you shortly.");
    e.currentTarget.reset();
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="text-center max-w-lg mx-auto mt-4 mb-10">
        <span className="divider-ornament eyebrow justify-center">Get In Touch</span>
        <h1 className="font-display text-3xl text-maroon-900 mt-2">
          Contact {CONTACT_INFO.brand}
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 border border-ink-300/25 bg-cream-100 p-4">
              <Phone size={18} className="text-gold-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Phone</p>
                <p className="text-sm font-medium text-ink-900">{CONTACT_INFO.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-ink-300/25 bg-cream-100 p-4">
              <Mail size={18} className="text-gold-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Email</p>
                <p className="text-sm font-medium text-ink-900">{CONTACT_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-ink-300/25 bg-cream-100 p-4 sm:col-span-2">
              <MapPin size={18} className="text-gold-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Address</p>
                <p className="text-sm font-medium text-ink-900">{CONTACT_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-ink-300/25 bg-cream-100 p-4 sm:col-span-2">
              <Clock size={18} className="text-gold-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Business Hours</p>
                <p className="text-sm font-medium text-ink-900">{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video bg-cream-300 flex items-center justify-center border border-ink-300/25">
            <p className="text-sm text-ink-500 flex items-center gap-2">
              <MapPin size={16} /> Map placeholder — embed Google Maps here
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-cream-100 border border-ink-300/25 p-6">
          <h2 className="font-display text-lg text-maroon-900">Send a Message</h2>
          <Input name="name" label="Name" required placeholder="Your name" />
          <Input name="phone" label="Phone" required type="tel" placeholder="+91 98765 43210" />
          <Input name="email" label="Email" required type="email" placeholder="you@example.com" />
          <Textarea name="message" label="Message" required placeholder="How can we help?" />
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
