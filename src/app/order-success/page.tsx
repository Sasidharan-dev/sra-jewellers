"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { useClientOrdersStore } from "@/lib/store/clientOrdersStore";
import { useHasMounted } from "@/lib/useHasMounted";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessInner />
    </Suspense>
  );
}

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const mounted = useHasMounted();
  const order = useClientOrdersStore((s) => (orderId ? s.orders[orderId] : undefined));

  return (
    <div className="container-page py-16 sm:py-24 max-w-xl mx-auto text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
        <CheckCircle2 size={34} />
      </span>
      <h1 className="font-display text-3xl text-maroon-900">
        Order Placed Successfully
      </h1>
      <p className="text-sm text-ink-500 mt-2">
        Thank you — a confirmation has been sent to your email.
      </p>

      <div className="mt-8 bg-cream-100 border border-ink-300/25 p-6 text-left">
        <div className="flex justify-between py-2 border-b border-ink-300/20">
          <span className="text-sm text-ink-500">Order ID</span>
          <span className="text-sm font-semibold text-maroon-900">
            {orderId ?? "—"}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-sm text-ink-500">Estimated Delivery</span>
          <span className="text-sm font-semibold text-ink-900">
            {mounted ? order?.estimatedDelivery ?? "5–9 business days" : "—"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href={`/track-order?orderId=${orderId ?? ""}`} icon={undefined}>
          Track Order
        </LinkButton>
        <LinkButton href="/shop" variant="outline">
          Continue Shopping
        </LinkButton>
      </div>
    </div>
  );
}
