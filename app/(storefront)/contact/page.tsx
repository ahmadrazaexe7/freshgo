import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | FreshGo"
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-12">
        <div className="max-w-3xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Contact</p>
          <h1 className="text-4xl font-display text-ink">Need help with an order?</h1>
          <p className="text-base leading-7 text-ink/70">
            Our support team is ready to help with delivery updates, product requests, and order questions. Reach out over WhatsApp, email, or browse our shop to continue shopping.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-[1.7rem] border border-brand-100 bg-brand-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">WhatsApp</p>
            <p className="mt-4 text-lg font-semibold text-ink">+92 336 3629981</p>
            <p className="mt-2 text-sm text-ink/64">Fastest response for order confirmation.</p>
          </div>
          <div className="rounded-[1.7rem] border border-brand-100 bg-brand-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Email</p>
            <p className="mt-4 text-lg font-semibold text-ink">support@freshgo.online</p>
            <p className="mt-2 text-sm text-ink/64">Send us details of your request anytime.</p>
          </div>
          <div className="rounded-[1.7rem] border border-brand-100 bg-brand-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Delivery</p>
            <p className="mt-4 text-lg font-semibold text-ink">Islamabad & Rawalpindi</p>
            <p className="mt-2 text-sm text-ink/64">Same-day delivery for both cities.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Browse shop
          </Link>
          <a
            href="https://wa.me/923363629981"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-brand-600 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
