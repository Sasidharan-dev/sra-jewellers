"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button, LinkButton } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { products } from "@/data/products";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Users,
} from "lucide-react";

type Address = {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: Address | null;
};
type Order = {
  orderId: string;
  total: number;
  orderDate: string;
  currentStepIndex: number;
  items?: { productId: string; name: string; quantity: number; price: number; size?: string }[];
};
type Section = "profile" | "orders" | "address" | "wishlist" | "help";

export default function AccountPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const replaceWishlist = useWishlistStore((state) => state.replace);

  useEffect(() => {
    const updateSection = () => {
      const value = new URLSearchParams(window.location.search).get("section");
      setSection((value as Section) || "profile");
    };
    updateSection();
    window.addEventListener("popstate", updateSection);
    return () => window.removeEventListener("popstate", updateSection);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/account/wishlist").then(async (response) => {
      if (response.ok) replaceWishlist((await response.json()).productIds);
    }).catch(() => undefined);
    const refreshOrders = () => fetch("/api/account/orders").then(async (response) => {
      if (response.ok) setOrders((await response.json()).orders);
    }).catch(() => undefined);
    const interval = window.setInterval(refreshOrders, 30000);
    return () => window.clearInterval(interval);
  }, [user?.id, replaceWishlist]);

  function setAccount(next: User) {
    setUser(next);
    setProfile({
      name: next.name,
      phone: next.phone,
      address: next.address?.address ?? "",
      city: next.address?.city ?? "",
      state: next.address?.state ?? "",
      pincode: next.address?.pincode ?? "",
      country: next.address?.country ?? "India",
    });
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) return;
        const result = await response.json();
        setAccount(result.user);
        const ordersResponse = await fetch("/api/account/orders");
        if (ordersResponse.ok) setOrders((await ordersResponse.json()).orders);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        password: form.get("password"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Something went wrong");
      return;
    }
    setAccount(result.user);
    if (result.user.role === "ADMIN") router.push("/admin");
  }

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const result = await response.json();
    setResetToken(result.resetToken ?? "");
    setResetMessage(result.message || result.error || "Reset request completed.");
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: resetToken, password }) });
    const result = await response.json();
    setResetMessage(result.message || result.error || "");
    if (response.ok) { setForgotMode(false); setResetToken(""); }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        phone: profile.phone,
        address: {
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          country: profile.country,
        },
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Could not save profile");
      return;
    }
    setAccount(result.user);
    setMessage("Profile and address saved successfully.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }
  async function cancelOrder(orderId: string) {
    if (!window.confirm("Request cancellation for this order?")) return;
    const response = await fetch(`/api/account/orders/${orderId}/cancel`, {
      method: "POST",
    });
    const result = await response.json();
    setMessage(result.message || result.error || "");
    if (response.ok) {
      const next = await fetch("/api/account/orders");
      if (next.ok) setOrders((await next.json()).orders);
    }
  }

  const links = [
    ["orders", "My Orders", ShoppingBag],
    ["profile", "Profile Information", UserRound],
    ["address", "Saved Address", MapPin],
    ["wishlist", "Wishlist", Heart],
    ["help", "Help & Support", HelpCircle],
  ] as const;

  function CustomerView() {
    const wishlistIds = useWishlistStore((state) => state.productIds);
    const wishlistItems = products.filter((product) => wishlistIds.includes(product.id));

    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <aside className="h-fit border border-ink-300/25 bg-cream-100">
          <div className="flex items-center gap-3 border-b border-ink-300/20 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-900 text-gold-400">
              <UserRound size={23} />
            </span>
            <div>
              <p className="text-xs text-ink-500">Hello,</p>
              <p className="font-medium text-maroon-900">{user?.name}</p>
            </div>
          </div>
          <nav className="p-3" aria-label="Account navigation">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              My account
            </p>
            {links.map(([key, label, Icon]) => (
              <a
                key={key}
                href={`/account?section=${key}`}
                className={`flex items-center justify-between px-3 py-3 text-sm ${section === key ? "bg-gold-100/40 font-medium text-maroon-900" : "text-ink-700 hover:bg-gold-100/40"}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {label}
                </span>
                <ChevronRight size={15} />
              </a>
            ))}
          </nav>
          <div className="border-t border-ink-300/20 p-4">
            <Button className="w-full" variant="outline" onClick={logout}>
              Sign Out <ArrowRight size={16} />
            </Button>
          </div>
        </aside>
        <main className="border border-ink-300/25 bg-cream-100 p-6 sm:p-8 lg:col-span-2">
          <div className="border border-gold-300/60 bg-gold-100/30 p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow text-gold-600">Customer Account</p>
              <h1 className="mt-1 font-display text-3xl text-maroon-900">
                Welcome, {user?.name}
              </h1>
              <p className="mt-2 text-sm text-ink-600">{user?.email}</p>
            </div>
            <span className="mt-4 inline-block border border-maroon-800/20 px-3 py-1 text-xs uppercase tracking-wider text-maroon-800 sm:mt-0">
              Member
            </span>
          </div>
          {section === "profile" && (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-maroon-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Update your contact details and default address.
              </p>
              <form onSubmit={saveProfile} className="mt-5 grid gap-3">
                <Input
                  label="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  required
                />
                <Input label="Email" value={user?.email ?? ""} disabled />
                <Input
                  label="Default Address"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="State"
                    value={profile.state}
                    onChange={(e) =>
                      setProfile({ ...profile, state: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Pincode"
                    value={profile.pincode}
                    onChange={(e) =>
                      setProfile({ ...profile, pincode: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Country"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                    required
                  />
                </div>
                {message && (
                  <p className="text-xs text-emerald-700">{message}</p>
                )}
                <Button type="submit" variant="outline">
                  Save Profile
                </Button>
              </form>
            </section>
          )}
          {section === "address" && (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-maroon-900">
                Saved Address
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                This address will be used automatically during checkout.
              </p>
              <div className="mt-5 border border-ink-300/25 p-5 text-sm">
                {profile.address ? (
                  <>
                    <p className="font-medium text-maroon-900">
                      {profile.name}
                    </p>
                    <p className="mt-2">{profile.address}</p>
                    <p>
                      {profile.city}, {profile.state} - {profile.pincode}
                    </p>
                    <p>{profile.country}</p>
                  </>
                ) : (
                  <p>
                    No saved address yet. Open Profile Information to add one.
                  </p>
                )}
              </div>
            </section>
          )}
          {section === "orders" && (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-maroon-900">
                My Orders
              </h2>
              {orders.length === 0 ? (
                <p className="mt-3 text-sm text-ink-500">
                  No orders yet. Your jewellery purchases will appear here.
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col gap-3 border border-ink-300/30 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <a href={`/account/orders/${order.orderId}`}>
                        <strong>{order.orderId}</strong>
                        <br />
                        <span className="text-xs text-ink-500">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-IN",
                          )}{" "}
                          · ₹{order.total.toLocaleString("en-IN")}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-wide text-gold-700">
                          {["Placed", "Confirmed", "Shipped", "Delivered"].map((label, index) => <span key={label} className={`rounded-full px-2 py-1 ${index <= order.currentStepIndex ? "bg-gold-500 text-maroon-950" : "bg-ink-100 text-ink-400"}`}>{label}</span>)}
                        </span>
                        {order.items && <span className="mt-2 block max-w-md text-xs text-ink-500">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(" · ")}</span>}
                      </a>
                      {order.currentStepIndex < 3 && (
                        <button
                          className="text-xs text-red-700 underline"
                          onClick={() => cancelOrder(order.orderId)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {section === "wishlist" && (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-maroon-900">
                Wishlist
              </h2>
              <p className="mt-1 text-sm text-ink-500">Your favourite jewellery pieces are saved here.</p>
              {wishlistItems.length === 0 ? <><p className="mt-5 text-sm text-ink-500">Your wishlist is empty.</p><LinkButton href="/shop" variant="outline" className="mt-5">Explore Jewellery <ArrowRight size={16} /></LinkButton></> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{wishlistItems.map((item) => <a key={item.id} href={`/product/${item.slug}`} className="border border-ink-300/25 p-4 hover:border-gold-500"><p className="font-medium text-maroon-900">{item.name}</p><p className="mt-1 text-sm text-ink-500">₹{item.price.toLocaleString("en-IN")}</p><span className="mt-3 inline-block text-xs text-gold-700">View product <ArrowRight size={13} className="inline" /></span></a>)}</div>}
            </section>
          )}
          {section === "help" && (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-maroon-900">
                Help & Support
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Need help with an order? Contact our support team with your
                order ID.
              </p>
              <LinkButton href="/contact" variant="outline" className="mt-5">
                Contact Us <ArrowRight size={16} />
              </LinkButton>
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <div className="mx-auto mt-8 max-w-6xl">
        {loading ? (
          <p className="text-center text-sm text-ink-500">Loading account…</p>
        ) : user ? (
          user.role === "ADMIN" ? (
            <div className="border border-ink-300/25 bg-cream-100 p-6 sm:p-8">
              <h1 className="font-display text-3xl text-maroon-900">
                Welcome, {user.name}
              </h1>
              <p className="mt-2 text-sm text-ink-500">{user.email}</p>
              <div className="mt-8 border border-maroon-800/20 bg-maroon-950 p-6 text-cream-100">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-maroon-950">
                    <ShieldCheck size={27} />
                  </span>
                  <div>
                    <p className="eyebrow text-gold-400">
                      Administrator Account
                    </p>
                    <h2 className="mt-1 font-display text-2xl">
                      SRA Jewellers Admin
                    </h2>
                    <p className="mt-1 text-sm text-cream-300/70">
                      Full store management access
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <LinkButton href="/admin" variant="outline">
                    Dashboard
                  </LinkButton>
                  <LinkButton href="/admin/orders" variant="outline">
                    Orders
                  </LinkButton>
                  <LinkButton href="/admin/products" variant="outline">
                    Products
                  </LinkButton>
                </div>
                <Button
                  className="mx-auto mt-6 max-w-sm"
                  variant="outline"
                  onClick={logout}
                >
                  Sign Out <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <CustomerView />
          )
        ) : (
          <div className="mx-auto max-w-lg border border-ink-300/25 bg-cream-100 p-6 sm:p-8">
            {forgotMode ? <><h1 className="font-display text-3xl text-maroon-900">Reset Password</h1><p className="mt-2 text-sm text-ink-500">Enter your email to generate a reset token.</p><form onSubmit={requestReset} className="mt-6 flex flex-col gap-4"><Input name="email" label="Email" type="email" required /><Button type="submit">Generate Reset Token</Button></form>{resetToken && <form onSubmit={resetPassword} className="mt-5 flex flex-col gap-4"><Input label="Reset Token" value={resetToken} readOnly /><Input name="password" label="New Password" type="password" minLength={8} required /><Button type="submit">Set New Password</Button></form>}{resetMessage && <p className="mt-4 text-sm text-emerald-700">{resetMessage}</p>}<button className="mt-5 text-sm text-maroon-800 underline" onClick={() => { setForgotMode(false); setResetMessage(""); }}>Back to sign in</button></> : <><h1 className="font-display text-3xl text-maroon-900">{mode === "login" ? "Sign In" : "Create Account"}</h1><form onSubmit={submit} className="mt-6 flex flex-col gap-4">{mode === "register" && <><Input name="name" label="Full Name" required /><Input name="phone" label="Phone" required /></>}<Input name="email" label="Email" type="email" required /><Input name="password" label="Password" type="password" minLength={8} required />{error && <p className="text-sm text-red-700">{error}</p>}<Button type="submit">{mode === "login" ? "Sign In" : "Create Account"}</Button></form>{mode === "login" && <button className="mt-4 text-sm text-maroon-800 underline" onClick={() => { setForgotMode(true); setError(""); }}>Forgot password?</button>}<button className="mt-5 block text-sm text-maroon-800 underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "New customer? Create an account" : "Already have an account? Sign in"}</button></>}
          </div>
        )}
      </div>
    </div>
  );
}
