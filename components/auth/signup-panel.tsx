"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store/store-provider";

export function SignupPanel() {
  const router = useRouter();
  const { register, login } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Clear field errors on submit attempt
    setNameError("");
    setEmailError("");
    setPasswordError("");

    // Basic client-side validation
    let isValid = true;

    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) {
      setSubmitting(false);
      return;
    }

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

    // Reset form on successful submission
    setName("");
    setEmail("");
    setPassword("");
    setNameError("");
    setEmailError("");
    setPasswordError("");

    // Redirect to orders after successful signup/login
    router.replace('/orders');
    setSubmitting(false);
  }

  return (
    <div className="mt-4 sm:mt-6 max-w-md w-full mx-auto px-4 sm:px-6">
      <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-soft border border-brand-50">
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-ink">Create Account</h1>
          <p className="mt-2 sm:mt-3 text-ink/60 text-sm">Sign up to start ordering from FreshGo.</p>
        </div>

        <form onSubmit={submit} className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <label htmlFor="name" className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 block mb-1">
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Clear error on input
                if (nameError && e.target.value.trim()) setNameError("");
              }}
              className="w-full min-h-[48px] rounded-2xl border border-brand-100 bg-brand-50/30 px-4 py-3 text-base text-ink transition-all focus:border-brand-400 focus:bg-white outline-none focus:ring-2 focus:ring-brand-200"
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
              required
            />
            {nameError && (
              <p id="name-error" className="mt-1 text-xs text-rose-600">{nameError}</p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 block mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error on input
                if (emailError && e.target.value.trim()) setEmailError("");
              }}
              className="w-full min-h-[48px] rounded-2xl border border-brand-100 bg-brand-50/30 px-4 py-3 text-base text-ink transition-all focus:border-brand-400 focus:bg-white outline-none focus:ring-2 focus:ring-brand-200"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              required
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-xs text-rose-600">{emailError}</p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-[0.75rem] font-bold uppercase tracking-wider text-ink/50 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // Clear error on input
                  if (passwordError && e.target.value.trim()) setPasswordError("");
                }}
                className="w-full min-h-[48px] rounded-2xl border border-brand-100 bg-brand-50/30 px-4 py-3 pr-10 text-base text-ink transition-all focus:border-brand-400 focus:bg-white outline-none focus:ring-2 focus:ring-brand-200"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-ink/50 hover:text-ink/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1 text-xs text-rose-600">{passwordError}</p>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 border border-rose-100">
              <p className="text-sm font-semibold text-rose-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] inline-flex items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-base font-bold text-white shadow-soft transition-all hover:bg-brand-800 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ink/50">Already have an account? <button onClick={() => router.push('/login')} className="font-bold text-brand-600 hover:underline transition-colors">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}