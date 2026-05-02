"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, LogOut, ShieldCheck, ShoppingBag } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";

const demoAccounts = [
  {
    label: "Customer demo",
    email: "customer@freshhomemart.pk",
    password: "Customer@12345",
    description: "Use for cart, checkout, wishlist, and order history."
  },
  {
    label: "Admin demo",
    email: "admin@freshhomemart.pk",
    password: "Admin@12345",
    description: "Use for product updates, order management, and dashboard access."
  },
  {
    label: "Admin (ID login)",
    email: "54471",
    password: "Rajput@9981",
    description: "Alternate admin login using numeric ID and password."
  }
];

export function LoginPanel() {
  const router = useRouter();
  const { login, user, logout } = useStore();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoAccounts[0].password);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const result = login(email, password);

    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    setError("");
    router.replace(email.includes("admin") ? "/admin" : "/orders");
    router.refresh();
    setSubmitting(false);
  }

  function loginAs(emailValue: string, passwordValue: string) {
    setEmail(emailValue);
    setPassword(passwordValue);
    setError("");

    const result = login(emailValue, passwordValue);

    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }

    router.replace(emailValue.includes("admin") ? "/admin" : "/orders");
    router.refresh();
  }

  if (user) {
    return (
      <div className="mt-6">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Account active</p>
          <h1 className="mt-2 font-display text-4xl text-ink">You are signed in as {user.name}.</h1>
          <p className="mt-4 text-base leading-7 text-ink/68">
            Your current role is <span className="font-semibold text-ink">{user.role}</span>. Continue to orders or
            the admin dashboard from here.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/orders"}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {user.role === "ADMIN" ? "Open admin dashboard" : "View my orders"}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Login</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Access your account or the admin console.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/68">
            This demo storefront includes two working local accounts so you can test the customer journey and store
            management experience end to end.
          </p>

          <form onSubmit={submit} className="mt-8 max-w-xl space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm text-ink outline-none"
                required
              />
            </label>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {demoAccounts.map((account, index) => (
            <button
              key={account.email}
              type="button"
              onClick={() => loginAs(account.email, account.password)}
              className="block w-full rounded-[2rem] bg-white p-6 text-left shadow-soft transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                {index === 0 ? <ShoppingBag className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <h2 className="mt-5 text-xl font-semibold text-ink">{account.label}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">{account.description}</p>
              <div className="mt-4 rounded-[1.4rem] bg-cream p-4 text-sm text-ink/76">
                <p>{account.email}</p>
                <p className="mt-1">{account.password}</p>
              </div>
            </button>
          ))}

          <article className="rounded-[2rem] bg-brand-900 p-6 text-white shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Demo-ready login flow</h2>
            <p className="mt-2 text-sm leading-6 text-white/74">
              The login experience is wired to the shared store so customer and admin views switch instantly across the
              app without page-level placeholders.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
