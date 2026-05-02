"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MenuSquare, ShieldCheck, User2 } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ActionToast } from "@/components/shared/action-toast";
import { FloatingWhatsAppButton } from "@/components/storefront/floating-whatsapp-button";
import { useStore } from "@/lib/store/store-provider";
import { cn } from "@/lib/utils";

type AccountTab = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  hidden?: boolean;
};

function getGreeting(userName?: string) {
  if (!userName) return "Welcome back";
  const first = userName.split(" ")[0] ?? userName;
  return `Hi, ${first}`;
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useStore();

  const tabs = useMemo<AccountTab[]>(
    () => [
      { label: "Login", href: "/login", icon: User2, hidden: Boolean(user) },
      { label: "Orders", href: "/orders", icon: MenuSquare },
      { label: "Admin", href: "/admin", icon: ShieldCheck, hidden: user?.role !== "ADMIN" }
    ],
    [user?.role, user]
  );

  const activeTabHref = useMemo(() => {
    if (!pathname) return "/orders";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/orders")) return "/orders";
    if (pathname.startsWith("/login")) return "/login";
    return "/orders";
  }, [pathname]);

  const greeting = getGreeting(user?.name);

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div />}>
        <SiteHeader />
      </Suspense>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Account</p>
              <h1 className="font-display text-4xl text-ink">{greeting}</h1>
              <p className="text-base leading-7 text-ink/66">
                {user?.role === "ADMIN"
                  ? "Manage orders, update products, and keep the store running smoothly."
                  : user
                    ? "Track your orders, reorder your favourites, and review delivery details."
                    : "Sign in to view your orders and manage your repeat shopping."}
              </p>
            </div>

            <nav aria-label="Account tabs" className="flex flex-wrap gap-2">
              {tabs
                .filter((tab) => !tab.hidden)
                .map((tab) => {
                  const isActive = tab.href === activeTabHref;
                  const Icon = tab.icon;

                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink/72 hover:text-brand-700 hover:bg-brand-50"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {tab.label}
                    </Link>
                  );
                })}
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</div>
      </main>

      <ActionToast />
      <FloatingWhatsAppButton />
      <SiteFooter />
    </div>
  );
}
