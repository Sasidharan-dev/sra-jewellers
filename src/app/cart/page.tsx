"use client";

import { products } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { useHasMounted } from "@/lib/useHasMounted";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CheckoutSummary, computeTotals } from "@/components/cart/CheckoutSummary";
import { LinkButton } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const mounted = useHasMounted();
  const lines = useCartStore((s) => s.lines);

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

  if (!mounted) return null;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="font-display text-3xl text-maroon-900 mt-3 mb-8">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag size={40} className="text-ink-300 mb-4" />
          <p className="font-display text-xl text-maroon-900 mb-2">
            Your cart is empty
          </p>
          <p className="text-sm text-ink-500 mb-6 max-w-sm">
            Explore our collections and add a few pieces you love.
          </p>
          <LinkButton href="/shop">Continue Shopping</LinkButton>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div>
            {items.map((item) => (
              <CartItemRow
                key={item.product.id + (item.size ?? "")}
                product={item.product}
                quantity={item.quantity}
                size={item.size}
              />
            ))}
            <div className="mt-6">
              <LinkButton href="/shop" variant="outline">
                Continue Shopping
              </LinkButton>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <CheckoutSummary totals={totals} itemCount={items.length} />
            <LinkButton href="/checkout" size="lg">
              Proceed to Checkout
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
