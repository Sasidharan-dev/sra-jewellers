"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { products } from "@/data/products";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, LinkButton } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

type Order = {
  orderId: string;
  customerName: string;
  orderDate: string;
  estimatedDelivery: string;
  currentStepIndex: number;
  paymentMethod: string;
  paymentStatus: string;
  address: { address: string; city: string; state: string; pincode: string; country: string };
  items: { productId: string; name: string; quantity: number; price: number; size?: string }[];
  subtotal: number;
  makingCharges: number;
  tax: number;
  total: number;
};

export default function CustomerOrderDetails({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    params.then(({ orderId: id }) => {
      if (cancelled) return;
      setOrderId(id);
      fetch(`/api/orders/${encodeURIComponent(id)}`).then(async (response) => {
        if (!response.ok) throw new Error("Order not found");
        return (await response.json()).order as Order;
      }).then((value) => { if (!cancelled) setOrder(value); }).catch(() => { if (!cancelled) setError("Order not found or no longer available."); }).finally(() => { if (!cancelled) setLoading(false); });
    });
    return () => { cancelled = true; };
  }, [params]);

  async function cancelOrder() {
    if (!order || !window.confirm("Request cancellation for this order?")) return;
    const response = await fetch(`/api/account/orders/${order.orderId}/cancel`, { method: "POST" });
    const result = await response.json();
    if (response.ok) setOrder({ ...order, currentStepIndex: 0, estimatedDelivery: "Cancellation requested" });
    else setError(result.error || "Could not cancel this order.");
  }

  return <div className="container-page py-10"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: "Order Details" }]} /><div className="mx-auto mt-8 max-w-5xl">{loading ? <p className="text-center text-sm text-ink-500">Loading order…</p> : error || !order ? <div className="flex flex-col items-center border border-ink-300/25 bg-cream-100 px-6 py-16 text-center"><PackageSearch size={38} className="text-ink-300" /><h1 className="mt-4 font-display text-2xl text-maroon-900">{error || "Order not found"}</h1><LinkButton href="/account?section=orders" variant="outline" className="mt-6">Back to My Orders</LinkButton></div> : <><div className="flex flex-col gap-4 border border-ink-300/25 bg-cream-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="eyebrow text-gold-600">Order Details</p><h1 className="mt-1 font-display text-3xl text-maroon-900">{order.orderId}</h1><p className="mt-2 text-sm text-ink-500">Placed on {new Date(order.orderDate).toLocaleDateString("en-IN")}</p></div><Button variant="outline" onClick={() => router.push("/account?section=orders")}><ArrowLeft size={16} /> Back to Orders</Button></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="border border-ink-300/25 bg-cream-100 p-6"><h2 className="font-display text-2xl text-maroon-900">Items Ordered</h2><div className="mt-5 flex flex-col gap-4">{order.items.map((item) => { const product = products.find((entry) => entry.id === item.productId); return <div key={`${item.productId}-${item.size ?? "default"}`} className="flex gap-4 border-b border-ink-300/20 pb-4 last:border-0"><div className="h-20 w-20 shrink-0 overflow-hidden bg-gold-100/30">{product?.image && <img src={product.image} alt={item.name} className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="font-medium text-maroon-900">{item.name}</p><p className="mt-1 text-xs text-ink-500">Qty: {item.quantity}{item.size ? ` · Size: ${item.size}` : ""}</p><p className="mt-2 text-sm font-semibold text-maroon-900">{formatINR(item.price * item.quantity)}</p></div></div>; })}</div><div className="mt-5 border-t border-ink-300/20 pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div><div className="mt-2 flex justify-between"><span>Making charges</span><span>{formatINR(order.makingCharges)}</span></div><div className="mt-2 flex justify-between"><span>GST</span><span>{formatINR(order.tax)}</span></div><div className="mt-3 flex justify-between border-t border-ink-300/20 pt-3 font-semibold text-maroon-900"><span>Total</span><span>{formatINR(order.total)}</span></div></div></section><aside className="border border-ink-300/25 bg-cream-100 p-6"><h2 className="font-display text-2xl text-maroon-900">Delivery Status</h2><div className="mt-5"><OrderTimeline currentStepIndex={order.currentStepIndex} /></div><p className="mt-5 border-t border-ink-300/20 pt-4 text-sm text-ink-600">Estimated delivery: <strong>{order.estimatedDelivery}</strong></p><div className="mt-5 border-t border-ink-300/20 pt-4 text-sm"><p className="font-medium text-maroon-900">Delivering to</p><p className="mt-2">{order.customerName}</p><p>{order.address.address}</p><p>{order.address.city}, {order.address.state} - {order.address.pincode}</p><p>{order.address.country}</p></div><p className="mt-5 text-xs text-ink-500">Payment: {order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>{order.currentStepIndex < 3 && <button className="mt-5 text-sm text-red-700 underline" onClick={cancelOrder}>Request cancellation</button>}</aside></div></>}</div></div>;
}
