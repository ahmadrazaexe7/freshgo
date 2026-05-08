"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Apple,
  ArrowUpDown,
  ChevronDown,
  Filter,
  Grid3X3,
  Heart,
  Leaf,
  List,
  Plus,
  Search,
  ShoppingBasket,
  X,
  Wheat,
  Sparkles,
  Flame
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { shopCategories, shopProducts, type ShopCategoryId, type ShopProduct } from "@/data/shop-catalog";
import { useStore } from "@/lib/store/store-provider";
import { cn } from "@/lib/utils";

const MotionDiv = motion.div as unknown as React.ComponentType<any>;

type SortOption = "popularity" | "price-low" | "price-high" | "newest" | "best-selling";
type FilterOption = "fresh" | "discount" | "best-seller" | "under-500";

type ShopCatalogProps = {
  initialQuery?: string;
  initialCategory?: ShopCategoryId;
};

const categoryIcons = {
  vegetables: Leaf,
  fruits: Apple,
  groceries: ShoppingBasket,
  pulses_rice: Wheat,
  dry_fruits: Sparkles,
  masala: Flame
};

// ─── Design tokens ─────────────────────────────────────────────────────────────
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

// ─── Sticky heights (tune to match your actual navbar height) ─────────────────
// Navbar = 73px → header bar = 73px
// Search/filter sticky bar = ~68px  → top: 73px
// Category tabs sticky       = ~56px  → top: 73+68 = 141px
// Product section scroll-mt  = 141+56+16 = 213px
const NAVBAR_H    = 73;
const SEARCHBAR_H = 68;
const TABBAR_H    = 56;
const SEARCH_TOP  = NAVBAR_H;                            // 73
const TABS_TOP    = NAVBAR_H + SEARCHBAR_H;              // 141
const SCROLL_MT   = NAVBAR_H + SEARCHBAR_H + TABBAR_H + 16; // 213

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity",   label: "Most Popular"        },
  { value: "price-low",    label: "Price: Low to High"  },
  { value: "price-high",   label: "Price: High to Low"  },
  { value: "newest",       label: "Newest First"        },
  { value: "best-selling", label: "Best Selling"        },
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "fresh",      label: "Fresh"       },
  { value: "discount",   label: "On Sale"     },
  { value: "best-seller",label: "Best Seller" },
  { value: "under-500",  label: "Under Rs 500"},
];

function sortProducts(products: ShopProduct[], sortBy: SortOption) {
  return [...products].sort((l, r) => {
    switch (sortBy) {
      case "price-low":    return l.price - r.price;
      case "price-high":   return r.price - l.price;
      case "newest":       return new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime();
      case "best-selling": return r.bestSellerScore - l.bestSellerScore;
      default:             return r.popularity - l.popularity;
    }
  });
}

function matchesFilters(product: ShopProduct, filters: FilterOption[]) {
  if (filters.length === 0) return true;
  return filters.every((f) => {
    switch (f) {
      case "fresh":       return product.badges.includes("Fresh");
      case "discount":    return product.badges.includes("Discount") || Boolean(product.compareAtPrice);
      case "best-seller": return product.badges.includes("Best Seller");
      case "under-500":   return product.price <= 500;
      default:            return true;
    }
  });
}

// ─── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.32em]" style={{ color: T.gold, fontFamily: T.fonts.sans }}>
      <span className="inline-block h-px w-6" style={{ background: T.gold }} />
      {children}
      <span className="inline-block h-px w-6" style={{ background: T.gold }} />
    </span>
  );
}

// ─── Compact Product Card (5-per-row) ─────────────────────────────────────────
function ShopProductCard({ product, priority = false }: { product: ShopProduct; priority?: boolean }) {
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const cartItem    = cart.find((i) => i.productId === product.id);
  const isInCart    = Boolean(cartItem);

  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id, 1); };
  const handleWishlist  = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(160deg, ${T.forestLight} 0%, ${T.forestMid} 100%)`,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Gold shimmer on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 55%)" }}
      />

      {/* ── Image area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            priority={priority}
            className="object-cover"
            style={{ transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)" }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#122A18] to-[#1A3B23]" />
        )}
        {/* Depth gradient */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${T.forest}CC 0%, transparent 50%)` }}
        />

        {/* Badge */}
        {product.badges[0] && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.48rem] font-black uppercase tracking-wider"
            style={{ background: "rgba(122,171,138,0.9)", color: "#fff", fontFamily: T.fonts.sans, backdropFilter: "blur(6px)" }}
          >
            {product.badges[0]}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: isWishlisted ? T.rose : "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Heart size={9} fill={isWishlisted ? "white" : "none"} stroke="white" strokeWidth={2.5} />
        </button>

        {/* Add-to-cart panel — slides up */}
        <div
          className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          style={{ zIndex: 20 }}
        >
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1 rounded-full py-1.5 text-[0.6rem] font-black uppercase tracking-[0.14em] shadow-lg transition-colors duration-150"
            style={{
              background: isInCart
                ? `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`
                : "rgba(255,255,255,0.93)",
              color: isInCart ? T.forest : "#0B1F12",
              fontFamily: T.fonts.sans,
            }}
          >
            {isInCart ? <><ShoppingBasket size={9} /> In Cart ({cartItem?.quantity})</> : <><Plus size={9} /> Add to Cart</>}
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="px-3 pb-3 pt-2.5">
        <p
          className="mb-0.5 text-[0.46rem] font-black uppercase tracking-[0.2em]"
          style={{ color: T.sage, fontFamily: T.fonts.sans }}
        >
          {product.unit}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3
            className="line-clamp-1 leading-tight hover:text-gold transition-colors duration-150"
            style={{ fontFamily: T.fonts.serif, fontWeight: 400, fontSize: "0.88rem", color: T.cream, letterSpacing: "0.015em" }}
          >
            {product.name}
          </h3>
        </Link>
        <div
          className="mt-2 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.4rem" }}
        >
          <span style={{ color: T.goldLight, fontFamily: T.fonts.sans, fontSize: "0.78rem", fontWeight: 600 }}>
            Rs {product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span style={{ color: T.creamDim, fontFamily: T.fonts.sans, fontSize: "0.65rem", textDecoration: "line-through" }}>
              Rs {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </MotionDiv>
  );
}

// ─── Main ShopCatalog ──────────────────────────────────────────────────────────
export function ShopCatalog({ initialQuery = "", initialCategory }: ShopCatalogProps) {
  const { products: storeProducts } = useStore();
  // Fallback to direct import if store products are empty (safety net)
  const products = storeProducts.length > 0 ? storeProducts : shopProducts;
  const hasInitialCategory = Boolean(initialCategory && shopCategories.some((c) => c.id === initialCategory));
  const preferredCategory: ShopCategoryId = hasInitialCategory ? (initialCategory as ShopCategoryId) : "vegetables";

  const [search,        setSearch]        = useState(initialQuery);
  const [sortBy,        setSortBy]        = useState<SortOption>("popularity");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [activeCategory,setActiveCategory]= useState<ShopCategoryId>(preferredCategory);
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("grid");
  const [showFilters,   setShowFilters]   = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);
  const initialScrollDone = useRef(false);

  useEffect(() => setSearch(initialQuery), [initialQuery]);

  // ── IntersectionObserver for active category tab ──
  useEffect(() => {
    const sections = shopCategories
      .map((c) => document.getElementById(c.id))
      .filter((s): s is HTMLElement => Boolean(s));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveCategory(visible.target.id as ShopCategoryId);
      },
      { rootMargin: `-${TABS_TOP + TABBAR_H + 8}px 0px -50% 0px`, threshold: [0.1, 0.3, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialScrollDone.current || !hasInitialCategory) return;
    initialScrollDone.current = true;
    setActiveCategory(preferredCategory);
    window.requestAnimationFrame(() =>
      document.getElementById(preferredCategory)?.scrollIntoView({ block: "start", behavior: "auto" })
    );
  }, [hasInitialCategory, preferredCategory]);

  const query = search.trim().toLowerCase();

  const filteredProducts = useMemo(
    () => products.filter((p) => {
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.unit.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.origin.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesSearch && matchesFilters(p, activeFilters);
    }),
    [activeFilters, products, query]
  );

  const categorySections = useMemo(
    () => shopCategories.map((c) => ({
      ...c,
      products: sortProducts(filteredProducts.filter((p) => p.category === c.id), sortBy),
    })),
    [filteredProducts, sortBy]
  );

  const visibleSections = useMemo(() => {
    if (!query && activeFilters.length === 0) return categorySections;
    return categorySections.filter((s) => s.products.length > 0);
  }, [activeFilters.length, categorySections, query]);

  const featuredMatches = useMemo(() => sortProducts(filteredProducts, sortBy).slice(0, 5), [filteredProducts, sortBy]);
  const quickSearches   = useMemo(() => [...products].sort((l, r) => r.popularity - l.popularity).slice(0, 4).map((p) => p.name), [products]);
  const resultsCount    = filteredProducts.length;

  function toggleFilter(f: FilterOption) {
    setActiveFilters((cur) => cur.includes(f) ? cur.filter((i) => i !== f) : [...cur, f]);
  }
  function clearAllFilters() { setActiveFilters([]); setSearch(""); }
  function scrollToCategory(id: ShopCategoryId) {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (TABS_TOP + TABBAR_H + 12);
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Grid class for 5-col
  const gridClass = viewMode === "grid"
    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
    : "flex flex-col gap-3";

  return (
    <div className="min-h-screen" style={{ background: T.forest, fontFamily: T.fonts.sans }}>

      {/* ── Sticky Search + Controls bar ───────────────────────────────────── */}
      <div
        className="sticky z-30 backdrop-blur-md"
        style={{ top: SEARCH_TOP, background: `${T.forest}F0`, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-3">
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: T.creamDim }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-white/10 py-2.5 pl-9 pr-4 text-[0.8rem] focus:outline-none focus:ring-2 transition-all"
                style={{ background: T.forestLight, color: T.cream, fontFamily: T.fonts.sans }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: T.creamDim }}>
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter chips — desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {filterOptions.map((f) => {
                const active = activeFilters.includes(f.value);
                return (
                  <button
                    key={f.value}
                    onClick={() => toggleFilter(f.value)}
                    className="rounded-full px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-all duration-150"
                    style={{
                      background: active ? T.gold : T.forestLight,
                      color: active ? T.forest : T.creamDim,
                      border: `1px solid ${active ? T.gold : "rgba(255,255,255,0.08)"}`,
                      fontFamily: T.fonts.sans,
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-[0.75rem] font-bold transition-all"
              style={{ background: T.forestLight, color: T.cream }}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {activeFilters.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-forest font-black">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-[0.75rem] font-bold transition-all"
                style={{ background: T.forestLight, color: T.cream }}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", sortOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <MotionDiv
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 p-1.5 shadow-2xl"
                    style={{ background: T.forestMid, zIndex: 50 }}
                  >
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                        className="w-full text-left rounded-xl px-4 py-2.5 text-[0.78rem] font-medium transition-colors"
                        style={{
                          background: sortBy === o.value ? "rgba(201,168,76,0.15)" : "transparent",
                          color: sortBy === o.value ? T.gold : "rgba(244,239,228,0.65)",
                          fontFamily: T.fonts.sans,
                        }}
                      >
                        {o.label}
                      </button>
                    ))}
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            {/* View toggle */}
            <div className="hidden lg:flex items-center rounded-full border border-white/10 p-1" style={{ background: T.forestLight }}>
              {(["grid", "list"] as const).map((mode) => {
                const Icon = mode === "grid" ? Grid3X3 : List;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className="p-1.5 rounded-full transition-colors"
                    style={{ background: viewMode === mode ? "rgba(201,168,76,0.2)" : "transparent", color: viewMode === mode ? T.gold : "rgba(244,239,228,0.4)" }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filter chips row */}
          {(activeFilters.length > 0 || search) && (
            <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[0.7rem]" style={{ color: T.creamDim }}>Active:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-0.5 text-[0.65rem] font-medium text-gold">
                    "{search}"
                    <button onClick={() => setSearch("")}><X className="h-2.5 w-2.5" /></button>
                  </span>
                )}
                {activeFilters.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-0.5 text-[0.65rem] font-medium text-gold">
                    {filterOptions.find((o) => o.value === f)?.label}
                    <button onClick={() => toggleFilter(f)}><X className="h-2.5 w-2.5" /></button>
                  </span>
                ))}
                <button onClick={clearAllFilters} className="text-[0.65rem] font-semibold text-gold underline hover:text-goldLight">
                  Clear all
                </button>
              </div>
              <span className="text-[0.7rem]" style={{ color: T.creamDim }}>{resultsCount} results</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Category Tabs ───────────────────────────────────────────── */}
      <div
        className="sticky z-20"
        style={{ top: TABS_TOP, background: `${T.forest}F5`, borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-hide">
            {shopCategories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-200"
                  style={{
                    background: isActive ? T.gold : T.forestLight,
                    color: isActive ? T.forest : "rgba(244,239,228,0.55)",
                    border: `1px solid ${isActive ? T.gold : "rgba(255,255,255,0.07)"}`,
                    boxShadow: isActive ? `0 4px 16px rgba(201,168,76,0.35)` : "none",
                    fontFamily: T.fonts.sans,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-6">

        {/* Search results header */}
        {resultsCount > 0 && (query || activeFilters.length > 0) && (
          <section className="mb-10">
            <Reveal>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <SectionLabel>Search Results</SectionLabel>
                  <h2 className="mt-2" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.4rem,3vw,2.2rem)", color: T.cream }}>
                    Best matches
                  </h2>
                </div>
                <p className="text-[0.75rem]" style={{ color: T.creamDim }}>{resultsCount} found</p>
              </div>
            </Reveal>
            <div className={gridClass}>
              {featuredMatches.map((p, i) => <ShopProductCard key={p.id} product={p} priority={i === 0} />)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {resultsCount === 0 && (
          <section
            className="mt-6 rounded-3xl border border-white/10 px-6 py-14 text-center"
            style={{ background: T.forestMid }}
          >
            <Reveal>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: T.forestLight }}>
                <Search className="h-8 w-8" style={{ color: T.sage }} />
              </div>
              <p className="mt-5 text-[0.6rem] font-black uppercase tracking-[0.25em]" style={{ color: T.gold }}>No matches found</p>
              <h2 className="mt-2" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.3rem,3vw,2rem)", color: T.cream }}>
                Nothing matches yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[0.82rem] leading-relaxed" style={{ color: T.creamDim }}>
                Try a simpler name or remove some filters.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {quickSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => { setSearch(term); setActiveFilters([]); }}
                    className="rounded-full border border-white/10 px-4 py-2 text-[0.75rem] font-semibold transition-all hover:border-gold/50 hover:text-gold"
                    style={{ background: T.forestLight, color: T.cream }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* Category sections */}
        {resultsCount > 0 && (
          <div className="space-y-14">
            {visibleSections.map((section) => {
              const Icon = categoryIcons[section.id];
              return (
                <section
                  key={section.id}
                  id={section.id}
                  style={{ scrollMarginTop: SCROLL_MT }}
                >
                  <Reveal>
                    <div
                      className="flex flex-col gap-4 pb-6 mb-6"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{ background: T.forestLight, border: `1px solid rgba(201,168,76,0.2)` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: T.gold }} />
                        </div>
                        <div>
                          <p className="text-[0.55rem] font-black uppercase tracking-[0.25em]" style={{ color: T.gold }}>{section.title}</p>
                          <h2 className="leading-tight" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.2rem,2.5vw,1.9rem)", color: T.cream }}>
                            {section.subtitle}
                          </h2>
                        </div>
                        <span
                          className="ml-auto rounded-full border border-gold/25 px-3 py-1 text-[0.65rem] font-semibold"
                          style={{ color: T.gold }}
                        >
                          {section.products.length} picks
                        </span>
                      </div>
                      <p className="max-w-xl text-[0.8rem] leading-relaxed" style={{ color: T.creamDim }}>
                        {section.blurb}
                      </p>
                    </div>
                  </Reveal>

                  <div className={gridClass}>
                    {section.products.map((p, i) => (
                      <ShopProductCard key={p.id} product={p} priority={section.id === activeCategory && i === 0} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}