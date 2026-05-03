"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  ShoppingCart,
  Truck,
  User2,
} from "lucide-react";

import { mainNav } from "@/data/navigation";
import { useStore } from "@/lib/store/store-provider";
import { formatPrice } from "@/lib/storefront";
import { cn } from "@/lib/utils";
import StreakModal from "./streak-modal";
import { useStreak } from "./use-streak";

export function SiteHeader() {
  const MotionHeader = motion.header as any;
  const { cartCount, wishlistCount, user, products } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);

  const { currentStreak } = useStreak();
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setSearch(searchParams.get("q") ?? ""), [pathname, searchParams]);

  const navItems = useMemo(() => {
    const primaryLinks = mainNav.filter(
      (item) => item.href !== "/login" && item.href !== "/admin"
    );
    return mounted && user?.role === "ADMIN"
      ? [...primaryLinks, { label: "Admin", href: "/admin" }]
      : primaryLinks;
  }, [mounted, user?.role]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setSearchFocused(false);
  };

  const accountHref = mounted && user?.role === "ADMIN" ? "/admin" : "/login";

  return (
    <MotionHeader
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-[#081D18]/90 backdrop-blur-md border-b border-white/5"
    >
      {/* Top Announcement Bar */}
      <div className="bg-[#051511] py-1.5 sm:py-2 text-[9px] sm:text-[11px] text-white/60 tracking-wide border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
              <Truck className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#D1B06B] flex-shrink-0" />
              <span className="text-[8px] sm:text-[11px] truncate">Rawalpindi & Islamabad</span>
            </div>
            <div className="hidden md:flex items-center text-[8px] sm:text-[11px] whitespace-nowrap">Free delivery above {formatPrice(3000)}</div>
          </div>

          {currentStreak > 0 && (
            <button
              onClick={() => setStreakOpen(true)}
              className="flex items-center gap-1 bg-[#D1B06B] px-2 sm:px-3 py-0.5 rounded-full font-bold text-[#081D18] text-[8px] sm:text-[10px] uppercase tracking-tighter hover:brightness-110 transition flex-shrink-0"
            >
              🔥 {currentStreak}d
            </button>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center gap-4 sm:gap-6 lg:gap-12">
        {/* Logo Refined */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="text-lg sm:text-2xl">🥬</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-serif font-bold text-white leading-none tracking-tight">FreshGo</span>
            <span className="text-[#D1B06B] text-[7px] sm:text-[9px] font-bold tracking-[0.2em] mt-0.5 uppercase">Nature Delivered</span>
          </div>
        </Link>

        {/* Desktop Navigation - Using Flex-1 to push Search Center */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-8 text-white/70 font-medium text-[12px] lg:text-[13px] tracking-wide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("hover:text-white transition-colors relative py-1 whitespace-nowrap", isActive && "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#D1B06B]")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Professional Search Bar */}
        <div ref={desktopSearchRef} className="flex-1 max-w-lg relative hidden lg:block">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-white/30 h-4 w-4 group-focus-within:text-[#D1B06B] transition-colors flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search organic produce..."
              className="w-full bg-white/5 border border-white/10 focus:border-[#D1B06B]/50 text-white text-sm placeholder:text-white/20 rounded-full py-2 lg:py-2.5 pl-10 lg:pl-11 pr-20 lg:pr-24 focus:outline-none focus:bg-white/[0.08] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 lg:right-1.5 top-1/2 -translate-y-1/2 bg-[#D1B06B] hover:bg-[#c4a159] text-[#081D18] px-3 lg:px-5 py-1 lg:py-1.5 rounded-full font-bold text-xs transition-all active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto lg:ml-0">
          <Link
            href={accountHref}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-white/80 hover:text-white transition-colors text-xs sm:text-sm font-medium rounded-lg hover:bg-white/5"
          >
            <User2 className="h-4 sm:h-4.5 w-4 sm:w-4.5 flex-shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">{mounted && user ? user.name?.split(" ")[0] : "Login"}</span>
          </Link>

          <Link href="/wishlist" className="relative p-1.5 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-full transition flex-shrink-0">
            <Heart className="h-4 sm:h-5 w-4 sm:w-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-[#D1B06B] text-[#081D18] text-[8px] sm:text-[10px] font-bold h-3.5 sm:h-4 w-3.5 sm:w-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-1.5 sm:gap-2.5 bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-white font-bold text-xs sm:text-sm transition-all active:scale-95"
          >
            <ShoppingCart className="h-3.5 sm:h-4.5 w-3.5 sm:w-4.5 flex-shrink-0" />
            <span className="hidden sm:inline">{formatPrice(340)}</span>
            {cartCount > 0 && (
              <span className="bg-[#D1B06B] text-[#081D18] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] rounded-full">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      <StreakModal open={streakOpen} onClose={() => setStreakOpen(false)} />
    </MotionHeader>
  );
}