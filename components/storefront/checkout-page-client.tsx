"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, ShieldCheck, Truck } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";
import { buildWhatsAppOrderUrl, formatPrice, getDeliveryFee } from "@/lib/storefront";

const cityOptions = ["Rawalpindi", "Islamabad"] as const;

export function CheckoutPageClient() {
  const { cart, products, placeOrder, user } = useStore();
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    city: "Rawalpindi",
    area: "",
    addressLine: "",
    notes: ""
  });
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item): item is { product: (typeof products)[number]; quantity: number } => Boolean(item)),
    [cart, products]
  );

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = getDeliveryFee(form.city, subtotal);
  const total = subtotal + deliveryFee;

  if (items.length === 0 && !submittedOrderId) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <h1 className="font-display text-4xl text-ink">Your checkout is waiting for a cart.</h1>
          <p className="mt-3 text-base leading-7 text-ink/66">
            Add a few products first, then return here to complete your cash-on-delivery order.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Go to shop
          </Link>
        </div>
      </section>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const order = placeOrder(form);

    if (order) {
      setSubmittedOrderId(order.id);
    }
  }

  const whatsappHref = buildWhatsAppOrderUrl({
    items: items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit
    })),
    total,
    city: form.city,
    area: form.area || "Area to confirm"
  });

  if (submittedOrderId) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink">Order placed successfully.</h1>
          <p className="mt-4 text-base leading-7 text-ink/68">
            Your order reference is <span className="font-semibold text-ink">{submittedOrderId}</span>. Our team can
            follow up on WhatsApp if you want to confirm delivery notes quickly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              View my orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Checkout</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Confirm your delivery details</h1>
          <p className="mt-3 text-base leading-7 text-ink/66">
            Cash on delivery is enabled by default. Fill in your address and we&apos;ll generate the order instantly.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Full name</span>
              <input
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Phone number</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                placeholder="+92 3xx xxxxxxx"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">City</span>
              <select
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Area / Sector</span>
              <input
                value={form.area}
                onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                placeholder="Bahria Town, F-11, DHA..."
                required
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-ink">Address</span>
              <input
                value={form.addressLine}
                onChange={(event) => setForm((current) => ({ ...current, addressLine: event.target.value }))}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                placeholder="House, street, apartment, landmark"
                required
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-ink">Delivery notes</span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                className="min-h-28 w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                placeholder="Gate code, floor, preferred call timing..."
              />
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-[1.4rem] bg-brand-50 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Cash on delivery only</p>
                <p className="mt-1 text-sm text-ink/64">Simple and trusted payment at your doorstep.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[1.4rem] bg-brand-50 p-4">
              <Truck className="mt-0.5 h-4 w-4 text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Local delivery flow</p>
                <p className="mt-1 text-sm text-ink/64">Built for Rawalpindi and Islamabad households.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            Place order
          </button>
        </form>

        <aside className="rounded-[2rem] bg-brand-900 p-6 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-200">Order summary</p>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-sm text-white/78">
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm text-white/78">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink"
          >
            <MessageCircle className="h-4 w-4" />
            Send order on WhatsApp
          </a>
        </aside>
      </div>
    </section>
  );
}
