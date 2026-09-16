"use client";

import { useState } from "react";
import { CheckCircle2, PenTool } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button, LinkButton } from "@/components/ui/Button";
import { CustomDesignUploader } from "@/components/custom-design/CustomDesignUploader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCustomDesignStore } from "@/lib/store/customDesignStore";
import { GoldPurity } from "@/types";

const jewelleryTypes = ["Ring", "Necklace", "Chain", "Earrings", "Bracelet", "Bangles", "Pendant", "Other"];
const purities: GoldPurity[] = ["18K", "22K", "24K"];

export default function CustomDesignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const addRequest = useCustomDesignStore((s) => s.addRequest);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (file) data.append("file", file);
    const response = await fetch("/api/custom-design-requests", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok) { window.alert(result.error || "Could not submit request"); return; }
    addRequest(result.request);
    setRequestId(result.request.id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container-page py-16 sm:py-24 max-w-lg mx-auto text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <CheckCircle2 size={34} />
        </span>
        <h1 className="font-display text-3xl text-maroon-900">
          Your design request has been received.
        </h1>
        <p className="text-sm text-ink-500 mt-3">
          Design Request ID
        </p>
        <p className="font-display text-2xl text-maroon-800 mt-1">{requestId}</p>
        <p className="text-sm text-ink-600 mt-5 leading-relaxed">
          Our design team will review your requirements
          {file ? " and uploaded reference" : ""} and get back to you with a
          detailed quotation within 2–3 business days.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <LinkButton href="/shop">Continue Shopping</LinkButton>
          <LinkButton href="/" variant="outline">Back to Home</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-maroon-950 text-cream-100 py-14">
        <div className="container-page text-center">
          <span className="divider-ornament eyebrow justify-center text-gold-400">
            Made Just For You
          </span>
          <h1 className="font-display text-4xl mt-3">Have a Design in Mind?</h1>
          <p className="text-cream-300/80 mt-3 max-w-lg mx-auto">
            Share your jewellery design with us and we&apos;ll bring it to life.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Custom Design" }]} />

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="fullName" label="Full Name" required placeholder="Your full name" />
            <Input name="phone" label="Phone Number" required type="tel" placeholder="+91 98765 43210" />
            <Input name="email" label="Email" required type="email" placeholder="you@example.com" className="sm:col-span-2" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Select name="jewelleryType" label="Jewellery Type" required defaultValue="">
              <option value="" disabled>Select type</option>
              {jewelleryTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
            <Select name="goldPurity" label="Gold Purity" required defaultValue="22K">
              {purities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Input name="approxWeight" label="Approximate Weight (g)" placeholder="e.g. 12" />
          </div>

          <Input name="budget" label="Budget (₹)" placeholder="e.g. 50,000 – 80,000" />

          <Textarea
            name="description"
            label="Design Description"
            required
            placeholder="Describe the design you have in mind — motifs, stones, occasion, references…"
          />

          <CustomDesignUploader file={file} onFileChange={setFile} />

          <p className="text-xs text-ink-500 -mt-2">
            Your uploaded design will be reviewed by SRA Jewellers and a
            detailed quotation will be shared with you before any work begins.
          </p>

          <Button type="submit" size="lg" icon={<PenTool size={16} />} fullWidth>
            Submit Design Request
          </Button>
        </form>
      </div>
    </div>
  );
}
