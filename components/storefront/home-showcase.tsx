"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  Sparkles,
  Leaf,
  Apple,
  ShoppingBasket,
  Zap,
  Star,
  Heart,
  Package,
  ChevronDown,
  Plus,
  Flame,
} from "lucide-react";
import { shopCategories, shopProducts, type ShopProduct } from "@/data/shop-catalog";
import { useStore } from "@/lib/store/store-provider";
import { formatPrice } from "@/lib/storefront";
import { cn } from "@/lib/utils";

// ─── Google Fonts injection ──────────────────────────────────────────────────
function FontInjector() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  forest: "#0B1F12",
  forestMid: "#122A18",
  forestLight: "#1A3B23",
  cream: "#F4EFE4",
  creamDim: "#BDB7AC",
  gold: "#C9A84C",
  goldLight: "#E2C87A",
  sage: "#7AAB8A",
  rose: "#C97A7A",
  fonts: {
    serif: "'Cormorant Garamond', serif",
    sans: "'Inter', sans-serif",
  }
};

const categoryIcons = {
  vegetables: Leaf,
  fruits: Apple,
  groceries: ShoppingBasket,
};

const groceryImages = [
  { src: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&q=90", alt: "Fresh fruits" },
  { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=90", alt: "Vegetables" },
  { src: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=90", alt: "Produce" },
  { src: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=900&q=90", alt: "Mangoes" },
  { src: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=900&q=90", alt: "Berries" },
];

// ─── Reusable reveal wrapper with enhanced animations ────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
  scale = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  scale?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Shimmer effect for cards ────────────────────────────────────────────────
function ShimmerOverlay() {
  return (
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
        backgroundSize: "200% 200%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 sm:gap-2 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.3em]"
      style={{ color: T.gold, fontFamily: T.fonts.sans }}
    >
      <span className="inline-block h-px w-6 sm:w-8" style={{ background: T.gold }} />
      {children}
      <span className="inline-block h-px w-6 sm:w-8" style={{ background: T.gold }} />
    </span>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{ background: `linear-gradient(to right, transparent, ${T.forestLight}, transparent)` }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO
// ═════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 120]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

  const headline = ["The Freshest", "Groceries,", "Delivered."];

  return (
    <section className="relative min-h-[85vh] overflow-hidden" style={{ background: T.forest }}>
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-20 mx-auto grid min-h-[85vh] max-w-[1280px] grid-cols-1 gap-0 px-6 lg:grid-cols-2 lg:px-12">
        <div className="flex flex-col justify-center py-16 lg:py-0 lg:pr-12">
          <h1
            className="mb-6 leading-[1.05] tracking-[-0.01em]"
            style={{
              fontFamily: T.fonts.serif,
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            }}
          >
            {headline.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  color: i === 2 ? T.gold : T.cream,
                  fontStyle: i === 1 ? "italic" : "normal",
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mb-6 sm:mb-8 max-w-sm text-xs sm:text-base font-light leading-relaxed"
            style={{ color: T.creamDim, fontFamily: T.fonts.sans }}
          >
            Premium produce sourced from local farms, delivered to your door the
            same day. Quality you can taste.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-full px-6 sm:px-8 py-3 sm:py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300"
              style={{ background: T.gold, color: T.forest, fontFamily: T.fonts.sans }}
            >
              <span className="relative z-10">Shop Now</span>
              <ArrowRight size={14} className="relative z-10 transition-transform group-hover:translate-x-1 sm:size-4" />
              <span className="absolute inset-0 translate-y-full rounded-full transition-transform duration-300 group-hover:translate-y-0" style={{ background: T.goldLight }} />
            </Link>
          </motion.div>
        </div>

        <motion.div className="hidden items-center justify-center lg:flex" style={{ y: yParallax }}>
          <div className="relative h-[65vh] w-full max-w-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.4 }}
              className="absolute right-0 top-[5%] h-[55%] w-[75%] overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              <Image src={groceryImages[0].src} alt={groceryImages[0].alt} fill className="object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="absolute left-0 top-[15%] h-[30%] w-[45%] overflow-hidden rounded-xl shadow-xl"
            >
              <Image src={groceryImages[1].src} alt={groceryImages[1].alt} fill className="object-cover" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - Hidden on mobile */}
      <motion.div
        className="hidden absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 sm:flex"
        style={{ opacity: opacityFade as any }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold" style={{ color: T.creamDim, fontFamily: T.fonts.sans }}>Scroll</span>
        <ChevronDown size={18} style={{ color: T.gold }} />
      </motion.div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ═════════════════════════════════════════════════════════════════════════════
function CategoryShowcase() {
  const categoryImages: Record<string, string> = {
    vegetables: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200",
    fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200",
    groceries: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200",
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: T.forest }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        
        <Reveal className="mb-10 sm:mb-14">
          <SectionLabel>Our Collection</SectionLabel>
          <h2 className="mt-3 sm:mt-4 leading-[1.05] tracking-tight" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)", color: T.cream }}>
            Shop by <span style={{ color: T.gold, fontStyle: "italic" }}>Category</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {shopCategories.map((cat, idx) => {
            const img = categoryImages[cat.id];
            // Making cards taller for the "Basket" look
            const isBig = idx === 0;

            return (
              <Reveal key={cat.id} delay={idx * 0.12} className={isBig ? "lg:col-span-1" : ""}>
                <Link href={`/shop?category=${cat.id}`}>
                  <div
                    className="group relative overflow-hidden rounded-2xl transition-all duration-700"
                    style={{
                      height: isBig ? "clamp(280px, 60vw, 450px)" : "clamp(240px, 50vw, 380px)", // Responsive heights
                      background: T.forestMid,
                    }}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={cat.title}
                        fill
                        priority={idx === 0}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}

                    {/* Darker gradient for better text legibility on busy bucket images */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                      <p className="mb-1 sm:mb-2 text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.25em]" style={{ color: T.sage, fontFamily: T.fonts.sans }}>
                        {cat.id}
                      </p>

                      <h3 className="mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl font-light" style={{ fontFamily: T.fonts.serif, color: T.cream }}>
                        {cat.title}
                      </h3>

                      <p className="mb-3 sm:mb-6 max-w-xs text-xs sm:text-sm font-light leading-relaxed text-white/60 line-clamp-2 sm:line-clamp-3" style={{ fontFamily: T.fonts.sans }}>
                        {cat.blurb}
                      </p>

                      <div className="inline-flex items-center gap-2 sm:gap-3 text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">
                        Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-2 sm:size-[14px]" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STREAK REWARDS (New Section)
// ═════════════════════════════════════════════════════════════════════════════
function StreakRewards() {
  const rewards = [
    { day: 3, perk: "3% off" },
    { day: 4, perk: "4% off" },
    { day: 5, perk: "5% off" },
    { day: 6, perk: "6% off" },
    { day: 7, perk: "7% off" },
    { day: 8, perk: "8% off" },
    { day: 9, perk: "9% off" },
    { day: 10, perk: "10% off" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: T.forestMid }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <Reveal className="mb-8 sm:mb-12">
          <SectionLabel>Loyalty Program</SectionLabel>
          <h2
            className="mt-3 sm:mt-4 leading-tight"
            style={{
              fontFamily: T.fonts.serif,
              fontWeight: 300,
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              color: T.cream,
            }}
          >
            Streak <span style={{ color: T.gold, fontStyle: "italic" }}>Rewards</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: Counter Card */}
          <Reveal className="lg:col-span-5" delay={0.1}>
          <div 
            className="relative h-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6 lg:p-8 lg:p-10"
            style={{ background: T.forestLight }}
          >
            <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-orange-500/10 text-orange-500">
                <Flame size={20} fill="currentColor" className="sm:size-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: T.fonts.serif }}>1 day</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500/70" style={{ fontFamily: T.fonts.sans }}>Current Streak</p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg font-light leading-relaxed text-white/60" style={{ fontFamily: T.fonts.sans }}>
                Streaks update automatically when you place orders—no manual clicks required.
              </p>

              {/* Day Track */}
              <div className="mt-8 sm:mt-12 flex justify-between gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-2 sm:gap-3">
                    <div 
                      className={cn(
                        "h-1 sm:h-1.5 w-full rounded-full transition-colors duration-500",
                        num === 1 ? "bg-orange-500" : "bg-white/10"
                      )}
                      style={{ width: 'clamp(16px, 2.5vw, 40px)' }}
                    />
                    <span 
                      className={cn(
                        "text-[0.5rem] sm:text-[0.6rem] font-bold",
                        num === 1 ? "text-orange-500" : "text-white/20"
                      )}
                    >
                      {num}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Rewards Table */}
          <Reveal className="lg:col-span-7" delay={0.2}>
            <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-6 lg:p-8 lg:p-10">
              <h4 className="mb-6 sm:mb-8 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#C9A84C]" style={{ fontFamily: T.fonts.sans }}>
                Reward Milestone Table
              </h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4">
                {rewards.map((r, i) => (
                  <div key={i} className="flex flex-col gap-1 sm:gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/30" style={{ fontFamily: T.fonts.sans }}>Day {r.day}</span>
                    <span className="text-base sm:text-lg lg:text-xl font-light text-white" style={{ fontFamily: T.fonts.serif }}>{r.perk}</span>
                  </div>
                ))}
              </div>

              <Divider className="my-6 sm:my-10 opacity-10" />

              <div className="flex items-start gap-3 sm:gap-5">
                <div className="mt-1 flex h-8 sm:h-10 w-8 sm:w-10 shrink-0 items-center justify-center rounded-full bg-sage/10 text-sage">
                  <Truck size={16} className="sm:size-[18px]" />
                </div>
                <p className="text-sm sm:text-base font-light italic leading-relaxed text-white/70" style={{ fontFamily: T.fonts.serif }}>
                  Free delivery on orders above <span className="text-white font-semibold not-italic">Rs 1,000</span> after day 10 of your streak.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STATS BAR
// ═════════════════════════════════════════════════════════════════════════════
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const stats = [
    { value: "2,400+", label: "Happy Customers" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50+", label: "Fresh Products" },
    { value: "< 4hrs", label: "Delivery Time" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20" style={{ background: T.forest }}>
      <Divider className="opacity-30" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="flex flex-col items-center gap-1 sm:gap-2 text-center"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl lg:text-5xl font-light" style={{ fontFamily: T.fonts.serif, color: T.gold }}>{s.value}</span>
              <span className="text-[0.6rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.25em]" style={{ color: T.creamDim, fontFamily: T.fonts.sans }}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <Divider className="opacity-30" />
    </section>
  );
}

// ═════════════════════════
// FEATURED PRODUCTS
// ═════════════════════════════════════════════════════════════════════════════
function FeaturedProducts({ products }: { products: ShopProduct[] }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const prioritized = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

  return (
    <section className="py-12 sm:py-20" style={{ background: T.forestMid }}>
      <div className="mx-auto max-w-[1100px] px-4">
        <Reveal className="flex flex-col items-center text-center mb-10">
          <SectionLabel>Curated Selection</SectionLabel>
          <h2 className="mt-2 text-3xl sm:text-5xl text-white tracking-tighter" style={{ fontFamily: T.fonts.serif, fontWeight: 300 }}>
            The <span style={{ color: T.gold, fontStyle: "italic" }}>Edit</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {prioritized.map((product, idx) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <Reveal key={product.id} delay={idx * 0.05}>
                <div className="group relative flex flex-col">
                  
                  {/* IMAGE: Minimalist frame with a very subtle inner glow */}
                  <div className="relative aspect-[1/1.2] overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 transition-all duration-500 group-hover:ring-white/20 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                    />
                    
                    {/* Floating Wishlist - Ultra Glassmorphism */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition-transform active:scale-90"
                      style={{ background: isWishlisted ? T.rose : 'rgba(255,255,255,0.05)' }}
                    >
                      <Heart size={12} fill={isWishlisted ? "white" : "none"} stroke="white" strokeWidth={2} />
                    </button>

                    {/* Desktop "Quick Add" - Appears as a soft blur overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full p-2 transition-transform duration-300 group-hover:translate-y-0 hidden lg:block">
                      <button 
                        onClick={() => addToCart(product.id, 1)}
                        className="w-full rounded-xl bg-white py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-2xl transition-colors hover:bg-gold hover:text-white"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>

                  {/* INFO: No background, very tight spacing */}
                  <div className="mt-3 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gold opacity-80 mb-0.5">{product.unit}</p>
                        <h3 className="truncate text-sm font-light text-cream/90" style={{ fontFamily: T.fonts.serif }}>
                          {product.name}
                        </h3>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Mobile Only: Simple thin line button to keep vertical height low */}
                    <button 
                      onClick={() => addToCart(product.id, 1)}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-1.5 text-[10px] font-medium text-white transition-all active:bg-white active:text-black lg:hidden"
                    >
                      <Plus size={10} /> Add
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// OTHER SECTIONS
// ═════════════════════════════════════════════════════════════════════════════
function PromoBanner() {
  const deals = [
    { label: "Mango Crate", savings: "Save 25%", qty: "5 kg" },
    { label: "Veggie Box", savings: "Save 20%", qty: "Mixed 4 kg" },
    { label: "Fruit Basket", savings: "Save 30%", qty: "Seasonal" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20" style={{ background: T.forest }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#122A18] p-5 sm:p-8 lg:p-16">
            <div className="relative z-10 grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="flex flex-col justify-center gap-3 sm:gap-4 lg:gap-6">
                <SectionLabel>Bulk Offers</SectionLabel>
                <h2 style={{ fontFamily: T.fonts.serif, fontSize: "clamp(1.3rem, 3.5vw, 3rem)", color: T.cream, lineHeight: 1.2 }}>
                  Save Big on <span style={{ color: T.gold, fontStyle: "italic" }}>Family Packs.</span>
                </h2>
                <p className="max-w-md text-xs sm:text-sm lg:text-base font-light text-white/60" style={{ fontFamily: T.fonts.sans }}>
                  Stock up on essentials and enjoy tiered discounts automatically applied at checkout.
                </p>
                <Link href="/shop" className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#C9A84C] px-5 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#E2C87A] w-fit">
                  Claim Deals <ArrowRight size={12} className="sm:size-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                {deals.map((deal, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg sm:rounded-xl border border-white/5 bg-white/5 p-3 sm:p-4 lg:p-5 backdrop-blur-sm">
                    <div>
                      <p className="text-sm sm:text-base lg:text-lg font-light text-white" style={{ fontFamily: T.fonts.serif }}>{deal.label}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40" style={{ fontFamily: T.fonts.sans }}>{deal.qty}</p>
                    </div>
                    <span className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-[0.6rem] sm:text-[0.7rem] font-bold uppercase text-[#C9A84C]" style={{ fontFamily: T.fonts.sans }}>{deal.savings}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialStrip() {
  const items = [
    { name: "Ayesha K.", text: "Freshest mangoes I have ever had. Delivered in 3 hours!" },
    { name: "Bilal R.", text: "The veggie crates are amazing value. Order every week now." },
    { name: "Sara M.", text: "COD option is a lifesaver. Trustworthy and always fresh." },
    { name: "Usman T.", text: "Best grocery service in Rawalpindi. Lightning fast!" },
    { name: "Hina F.", text: "Love the quality. Never going back to a regular store." },
  ];

  return (
    <section className="overflow-hidden py-12 sm:py-16 lg:py-20" style={{ background: T.forest }}>
      <Reveal className="mb-8 sm:mb-12 text-center px-4">
        <SectionLabel>Customer Stories</SectionLabel>
      </Reveal>
      <div className="relative">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex w-max gap-4 sm:gap-6 px-6">
          {[...items, ...items].map((t, i) => (
            <div key={i} className="w-[280px] sm:w-[340px] lg:w-[380px] rounded-xl sm:rounded-2xl border border-white/5 bg-[#122A18] p-4 sm:p-6 lg:p-8 flex-shrink-0">
              <div className="mb-3 sm:mb-4 flex gap-1">
                {[...Array(5)].map((_, s) => <Star key={s} size={10} className="sm:size-3" fill={T.gold} stroke="none" />)}
              </div>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg font-light italic leading-relaxed text-white" style={{ fontFamily: T.fonts.serif }}>"{t.text}"</p>
              <p className="text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-widest text-sage" style={{ fontFamily: T.fonts.sans }}>— {t.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Truck, title: "Same-Day Delivery", desc: "Order by 2 PM and receive your groceries before evening." },
    { icon: ShieldCheck, title: "Quality Guaranteed", desc: "100% fresh produce or your money back — no questions asked." },
    { icon: Sparkles, title: "Curated Selection", desc: "Every product is hand-picked from premium local farms." },
    { icon: Package, title: "Bulk Savings", desc: "Tiered discounts applied automatically as you add to cart." },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20" style={{ background: T.forestMid }}>
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gold/10 border border-gold/20 text-gold">
                  <f.icon size={20} className="sm:size-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-light text-white" style={{ fontFamily: T.fonts.serif }}>{f.title}</h3>
                <p className="text-xs sm:text-sm font-light leading-relaxed text-white/50" style={{ fontFamily: T.fonts.sans }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 text-center px-4 sm:px-6" style={{ background: T.forest }}>
      <Reveal className="flex flex-col items-center gap-4 sm:gap-6">
        <SectionLabel>Start Now</SectionLabel>
        <h2 style={{ fontFamily: T.fonts.serif, fontSize: "clamp(1.5rem, 4vw, 4rem)", color: T.cream, lineHeight: 1.2 }}>
          The kitchen of your <br/> <span style={{ color: T.gold, fontStyle: "italic" }}>dreams</span> starts here.
        </h2>
        <Link href="/shop" className="group mt-3 sm:mt-5 inline-flex items-center gap-2 sm:gap-4 rounded-full bg-[#C9A84C] px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-105">
          Start Shopping <ArrowRight size={16} className="sm:size-[18px]" />
        </Link>
      </Reveal>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT (Updated Order: Categories -> Streak Rewards -> Stats)
// ═════════════════════════════════════════════════════════════════════════════
export function HomeShowcase() {
  const { products } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main style={{ background: T.forest, fontFamily: T.fonts.sans }}>
      <FontInjector />
      <HeroSection />
      
      <CategoryShowcase />
      
      {/* Streak Rewards Section Added Here */}
      <StreakRewards />
      
      <StatsBar />
      
      <FeaturedProducts products={products} />
      <PromoBanner />
      <TestimonialStrip />
      <FeaturesSection />
      <FooterCTA />
    </main>
  );
}

export default HomeShowcase;
