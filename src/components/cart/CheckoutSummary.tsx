import { formatINR } from "@/lib/utils";

export interface OrderTotals {
  subtotal: number;
  makingCharges: number;
  gst: number;
  total: number;
}

export function computeTotals(
  items: { price: number; makingCharge: number; quantity: number }[]
): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const makingCharges = items.reduce(
    (sum, i) => sum + i.makingCharge * i.quantity,
    0
  );
  const gst = Math.round((subtotal + makingCharges) * 0.03);
  return {
    subtotal,
    makingCharges,
    gst,
    total: subtotal + makingCharges + gst,
  };
}

export function CheckoutSummary({
  totals,
  itemCount,
}: {
  totals: OrderTotals;
  itemCount: number;
}) {
  return (
    <div className="bg-cream-100 border border-ink-300/25 p-6">
      <h3 className="font-display text-lg text-maroon-900 mb-4">
        Order Summary
      </h3>
      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-500">Subtotal ({itemCount} items)</dt>
          <dd className="text-ink-900">{formatINR(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Making Charges</dt>
          <dd className="text-ink-900">{formatINR(totals.makingCharges)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Estimated GST (3%)</dt>
          <dd className="text-ink-900">{formatINR(totals.gst)}</dd>
        </div>
      </dl>
      <div className="mt-4 pt-4 border-t border-ink-300/25 flex justify-between items-baseline">
        <span className="font-medium text-ink-900">Total</span>
        <span className="text-xl font-semibold text-maroon-900">
          {formatINR(totals.total)}
        </span>
      </div>
      <p className="mt-3 text-[11px] text-ink-500">
        Final amount is confirmed against the live gold rate at billing.
        {/* TODO(backend): recompute against real-time gold rate + tax API */}
      </p>
    </div>
  );
}
