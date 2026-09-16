"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { useClientOrdersStore } from "@/lib/store/clientOrdersStore";
import { useHasMounted } from "@/lib/useHasMounted";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckoutSummary, computeTotals } from "@/components/cart/CheckoutSummary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Wallet, CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "upi" | "card" | "cod";
type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = { key: string; amount: number; currency: string; name: string; description: string; order_id: string; prefill: { name: string; email: string; contact: string }; handler: (response: RazorpayResponse) => void };
type RazorpayConstructor = new (options: RazorpayOptions) => { open: () => void; on: (event: string, callback: () => void) => void };

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useClientOrdersStore((s) => s.addOrder);

  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [submitting, setSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", country: "India" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) router.replace("/account?next=/checkout");
        else { const result = await response.json(); const user = result.user; setProfile({ name: user.name, phone: user.phone, email: user.email, address: user.address?.address ?? "", city: user.address?.city ?? "", state: user.address?.state ?? "", pincode: user.address?.pincode ?? "", country: user.address?.country ?? "India" }); setAuthChecked(true); }
      })
      .catch(() => router.replace("/account?next=/checkout"));
  }, [router]);

  const items = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { product, ...line } : null;
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  const totals = computeTotals(
    items.map((i) => ({
      price: i.product.price,
      makingCharge: i.product.makingCharge,
      quantity: i.quantity,
    }))
  );

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        customerName: form.get("fullName"), phone: form.get("phone"), email: form.get("email"),
        address: { address: form.get("address"), city: form.get("city"), state: form.get("state"), pincode: form.get("pincode"), country: form.get("country") },
        paymentMethod: payment, items: lines,
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not place order");
      const order = result.order;
      if (payment !== "cod") {
        const razorpayOrderResponse = await fetch("/api/payments/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internalOrderId: order.orderId, amount: order.total * 100 }) });
        const razorpayOrder = await razorpayOrderResponse.json();
        if (!razorpayOrderResponse.ok) throw new Error(razorpayOrder.error || "Online payment is not configured");
        await new Promise<void>((resolve, reject) => {
          const finish = (callback: () => void) => { callback(); resolve(); };
          const openCheckout = () => {
            const Razorpay = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
            if (!Razorpay) { reject(new Error("Razorpay checkout could not load")); return; }
            const checkout = new Razorpay({ key: razorpayOrder.keyId, amount: razorpayOrder.amount, currency: razorpayOrder.currency, name: "SRA Jewellers", description: `Order ${order.orderId}`, order_id: razorpayOrder.razorpayOrderId, prefill: { name: profile.name, email: profile.email, contact: profile.phone }, handler: async (paymentResponse) => { try { const verify = await fetch("/api/payments/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internalOrderId: order.orderId, ...paymentResponse }) }); const verifyResult = await verify.json(); if (!verify.ok) throw new Error(verifyResult.error || "Payment verification failed"); finish(() => undefined); } catch (verificationError) { reject(verificationError); } } });
            checkout.on("payment.failed", () => reject(new Error("Payment failed or was cancelled")));
            checkout.open();
          };
          if ((window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay) openCheckout();
          else { const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = openCheckout; script.onerror = () => reject(new Error("Could not load Razorpay checkout")); document.body.appendChild(script); }
        });
      }
      addOrder({ orderId: order.orderId, customerName: order.customerName, orderDate: new Date(order.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), estimatedDelivery: order.estimatedDelivery, currentStepIndex: order.currentStepIndex, items: order.items, total: order.total });
      clearCart();
      router.push(`/order-success?orderId=${order.orderId}`);
    } catch (error) { window.alert(error instanceof Error ? error.message : "Could not place order"); setSubmitting(false); }
  }

  if (!mounted || !authChecked) return null;

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="font-display text-xl text-maroon-900 mb-2">
          Your cart is empty
        </p>
        <p className="text-sm text-ink-500">Add a few items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="font-display text-3xl text-maroon-900 mt-3 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-display text-lg text-maroon-900 mb-4">
              Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input id="full-name" name="fullName" label="Full Name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required placeholder="Your full name" />
              <Input name="phone" label="Phone Number" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} required type="tel" placeholder="+91 98765 43210" />
              <Input
                name="email"
                label="Email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                required
                type="email"
                placeholder="you@example.com"
                className="sm:col-span-2"
              />
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-maroon-900 mb-4">
              Delivery Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Textarea
                name="address"
                label="Address"
                value={profile.address}
                onChange={(event) => setProfile({ ...profile, address: event.target.value })}
                required
                placeholder="House no., street, area"
                className="sm:col-span-2"
              />
              <Input name="city" label="City" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} required placeholder="City" />
              <Input name="state" label="State" value={profile.state} onChange={(event) => setProfile({ ...profile, state: event.target.value })} required placeholder="State" />
              <Input name="pincode" label="Pincode" value={profile.pincode} onChange={(event) => setProfile({ ...profile, pincode: event.target.value })} required placeholder="6-digit pincode" />
              <Select name="country" label="Country" value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })}>
                <option>India</option>
              </Select>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-maroon-900 mb-4">
              Payment Method
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "upi", label: "UPI", icon: Wallet },
                { id: "card", label: "Card", icon: CreditCard },
                { id: "cod", label: "Cash on Delivery", icon: Banknote },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPayment(method.id as PaymentMethod)}
                  aria-pressed={payment === method.id}
                  className={cn(
                    "flex flex-col items-center gap-2 border px-4 py-4 text-sm transition-colors",
                    payment === method.id
                      ? "border-maroon-800 bg-maroon-800/5 text-maroon-900"
                      : "border-ink-300/40 text-ink-700 hover:border-maroon-800/60"
                  )}
                >
                  <method.icon size={18} />
                  {method.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Order details are securely sent to the SRA Jewellers backend. Online payment gateway can be enabled with Razorpay keys.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <CheckoutSummary totals={totals} itemCount={items.length} />
          <Button type="submit" size="lg" disabled={submitting} fullWidth>
            {submitting ? "Placing Order…" : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
