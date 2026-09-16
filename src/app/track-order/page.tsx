"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Search } from "lucide-react";
import { mockOrders } from "@/data/orders";
import { useClientOrdersStore } from "@/lib/store/clientOrdersStore";
import { useHasMounted } from "@/lib/useHasMounted";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatINR } from "@/lib/utils";
import { MockOrder } from "@/types";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderInner />
    </Suspense>
  );
}

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const mounted = useHasMounted();
  const clientOrders = useClientOrdersStore((s) => s.orders);

  const [orderId, setOrderId] = useState(searchParams.get("orderId") ?? "");
  const [searchedId, setSearchedId] = useState(searchParams.get("orderId") ?? "");
  const [remoteOrder, setRemoteOrder] = useState<MockOrder | undefined>();
  const [remoteOrderId, setRemoteOrderId] = useState("");
  const remoteLoading = !!searchedId.trim() && remoteOrderId !== searchedId.trim();

  useEffect(() => {
    if (!searchedId.trim()) return;
    let cancelled = false;
    fetch(`/api/orders/${encodeURIComponent(searchedId.trim())}`)
      .then(async (response) => response.ok ? (await response.json()).order : undefined)
      .then((value) => { if (!cancelled) { setRemoteOrder(value); setRemoteOrderId(searchedId.trim()); } })
      .catch(() => { if (!cancelled) { setRemoteOrder(undefined); setRemoteOrderId(searchedId.trim()); } });
    return () => { cancelled = true; };
  }, [searchedId]);

  const order = searchedId
    ? (remoteOrderId === searchedId.trim() ? remoteOrder : undefined) ?? clientOrders[searchedId.trim()] ?? mockOrders[searchedId.trim()]
    : undefined;
  const notFound = mounted && !!searchedId && !remoteLoading && !order;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchedId(orderId.trim());
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
      <div className="max-w-xl mx-auto text-center mt-4 mb-10">
        <span className="divider-ornament eyebrow justify-center">
          Order Status
        </span>
        <h1 className="font-display text-3xl text-maroon-900 mt-2">
          Track Your Order
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          Enter your Order ID (e.g. SRA-2026-00124) to see its current status.
        </p>
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <label htmlFor="order-id-input" className="sr-only">
            Order ID
          </label>
          <input
            id="order-id-input"
            placeholder="SRA-2026-00124"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="min-w-0 flex-1 border border-ink-300/50 bg-cream-100 px-3.5 py-3 text-sm outline-none focus:border-gold-500"
          />
          <Button type="submit" icon={<Search size={15} />}>
            Track Order
          </Button>
        </form>
        <p className="mt-3 text-xs text-ink-500">
          Try a sample ID: SRA-2026-00124, SRA-2026-00098, SRA-2026-00045
        </p>
      </div>

      {mounted && notFound && (
        <div className="flex flex-col items-center text-center py-10">
          <PackageSearch size={36} className="text-ink-300 mb-3" />
          <p className="font-display text-lg text-maroon-900">
            No order found for &ldquo;{searchedId}&rdquo;
          </p>
          <p className="text-sm text-ink-500 mt-1">
            Double-check the Order ID and try again.
          </p>
        </div>
      )}

      {mounted && order && (
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-8 bg-cream-100 border border-ink-300/25 p-6 sm:p-8">
          <div>
            <dl className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex justify-between">
                <dt className="text-ink-500">Order ID</dt>
                <dd className="font-semibold text-maroon-900">{order.orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Customer Name</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Order Date</dt>
                <dd>{order.orderDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Estimated Delivery</dt>
                <dd>{order.estimatedDelivery}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-ink-300/20">
                <dt className="text-ink-500">Order Total</dt>
                <dd className="font-semibold text-maroon-900">{formatINR(order.total)}</dd>
              </div>
            </dl>
            <ul className="text-xs text-ink-500 flex flex-col gap-1">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.size ?? "default"}`}>
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
          </div>
          <OrderTimeline currentStepIndex={order.currentStepIndex} />
        </div>
      )}
    </div>
  );
}
