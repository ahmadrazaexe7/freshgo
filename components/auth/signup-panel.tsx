"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useStore } from "@/lib/store/store-provider";

export function SignupPanel() {
  const router = useRouter();
  const { register, login } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = register(email.trim(), password, name.trim());

    if (!res.ok) {
      setError(res.error ?? "Failed to create account");
      setSubmitting(false);
      return;
    }

    // Optionally auto-login
    const logged = login(email.trim(), password);

    if (!logged.ok) {
      // still redirect to login page
      router.replace('/login');
      setSubmitting(false);
      return;
    }

    // Redirect to orders after successful signup/login
    router.replace('/orders');
    setSubmitting(false);
  }

  return (
    <div className="mt-10 max-w-[500px] mx-auto">
      <div className="rounded-[2.5rem] bg-white p-10 shadow-soft border border-brand-50">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-ink">Create Account</h1>
          <p className="mt-3 text-ink/60 text-sm">Sign up to start ordering from FreshGo.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 ml-2">Full name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4 text-sm text-ink transition-all focus:border-brand-400 focus:bg-white outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 ml-2">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4 text-sm text-ink transition-all focus:border-brand-400 focus:bg-white outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 ml-2">Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4 text-sm text-ink transition-all focus:border-brand-400 focus:bg-white outline-none"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 border border-rose-100">
              <p className="text-xs font-semibold text-rose-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-full bg-brand-900 px-6 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-brand-800 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-ink/50">Already have an account? <button onClick={() => router.push('/login')} className="font-bold text-brand-600 hover:underline">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}
