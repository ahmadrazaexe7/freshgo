"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, UserCircle, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store/store-provider";

export function LoginPanel() {
  const router = useRouter();
  const { login, user, logout } = useStore();
  
  // State initialized as empty for professional use
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = login(email, password);

      if (!result.ok) {
        setError(result.error ?? "Invalid email or password.");
        setSubmitting(false);
        return;
      }

      // Redirect based on role
      const destination = email.includes("admin") ? "/admin" : "/orders";
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Authenticated State ---
  if (user) {
    return (
      <div className="mt-6 max-w-2xl mx-auto">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-soft border border-brand-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Active Session</p>
              <h1 className="font-display text-2xl text-ink">Welcome back, {user.name}</h1>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-ink/70">
            You are currently signed in as <span className="font-semibold text-ink italic">{user.role.toLowerCase()}</span>. 
            Access your dashboard or manage your account below.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => router.push(user.role === "ADMIN" ? "/admin" : "/orders")}
              className="flex-1 min-w-[200px] inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {user.role === "ADMIN" ? "Go to Admin Console" : "View My Orders"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-8 py-4 text-sm font-bold text-ink transition-colors hover:bg-brand-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Unauthenticated State (The Form) ---
  return (
    <div className="mt-10 max-w-[500px] mx-auto">
      <div className="rounded-[2.5rem] bg-white p-10 shadow-soft border border-brand-50">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-ink">Sign In</h1>
          <p className="mt-3 text-ink/60 text-sm">Please enter your credentials to access your account.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 ml-2">
              Email Address
            </label>
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
            <div className="flex justify-between items-center px-2">
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50">
                Password
              </label>
              <button type="button" className="text-[0.7rem] font-bold text-brand-600 hover:underline">
                Forgot?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
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
              "Sign In to Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-ink/50">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push('/signup')} className="font-bold text-brand-600 hover:underline">Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}