"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Apple,
  ArrowRight,
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
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { shopCategories, type ShopCategoryId, type ShopProduct } from "@/data/shop-catalog";
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
  groceries: ShoppingBasket
};

// ─── Design tokens (matching home theme) ─────────────────────────────────────
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

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "best-selling", label: "Best Selling" },
];

const filterOptions: { value: FilterOption; label: string; icon: any }[] = [
  { value: "fresh", label: "Fresh", icon: Leaf },
  { value: "discount", label: "On Sale", icon: ShoppingBasket },
  { value: "best-seller", label: "Best Seller", icon: Heart },
  { value: "under-500", label: "Under Rs. 500", icon: Search },
];

function sortProducts(products: ShopProduct[], sortBy: SortOption) {
  const sorted = [...products];

  sorted.sort((left, right) => {
    switch (sortBy) {
      case "price-low":
        return left.price - right.price;
      case "price-high":
        return right.price - left.price;
      case "newest":
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      case "best-selling":
        return right.bestSellerScore - left.bestSellerScore;
      case "popularity":
      default:
        return right.popularity - left.popularity;
    }
  });

  return sorted;
}

function matchesFilters(products: ShopProduct[], filters: FilterOption[]) {
  if (filters.length === 0) return true;

  return products.filter((product) => {
    return filters.every((filter) => {
      switch (filter) {
        case "fresh":
          return product.badges.includes("Fresh");
        case "discount":
          return product.badges.includes("Discount") || Boolean(product.compareAtPrice);
        case "best-seller":
          return product.badges.includes("Best Seller");
        case "under-500":
          return product.price <= 500;
        default:
          return true;
      }
    });
  });
}

// ─── Reusable reveal wrapper ─────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em]"
      style={{ color: T.gold, fontFamily: T.fonts.sans }}
    >
      <span className="inline-block h-px w-8" style={{ background: T.gold }} />
      {children}
      <span className="inline-block h-px w-8" style={{ background: T.gold }} />
    </span>
  );
}

// ─── Product Card Component (inline for theme consistency) ───────────────────
function ShopProductCard({ product, priority = false }: { product: ShopProduct; priority?: boolean }) {
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((item) => item.productId === product.id);
  const isInCart = Boolean(cartItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl"
      style={{ background: T.forestLight }}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F12]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-sage/90 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-white"
              style={{ fontFamily: T.fonts.sans }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition-all hover:scale-110"
          style={{ background: isWishlisted ? T.rose : 'rgba(255,255,255,0.1)' }}
        >
          <Heart size={12} fill={isWishlisted ? "white" : "none"} stroke="white" />
        </button>

        {/* Quick Add to Cart */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-0 p-3"
        >
          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full rounded-full py-3 text-sm font-bold uppercase tracking-[0.1em] shadow-lg transition-all",
              isInCart
                ? "bg-gold text-forest"
                : "bg-white text-black hover:bg-gold hover:text-forest"
            )}
          >
            {isInCart ? `In Cart (${cartItem?.quantity})` : "Add to Cart"}
          </button>
        </MotionDiv>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div>
          <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-widest text-sage" style={{ fontFamily: T.fonts.sans }}>{product.unit}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-lg font-light text-white" style={{ fontFamily: T.fonts.serif }}>{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-lg font-medium text-goldLight" style={{ fontFamily: T.fonts.sans }}>
            Rs {product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-creamDim line-through" style={{ fontFamily: T.fonts.sans }}>
              Rs {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </MotionDiv>
  );
}

export function ShopCatalog({ initialQuery = "", initialCategory }: ShopCatalogProps) {
  const { products } = useStore();
  const hasInitialCategory = Boolean(
    initialCategory && shopCategories.some((category) => category.id === initialCategory)
  );
  const preferredCategory: ShopCategoryId = hasInitialCategory ? (initialCategory as ShopCategoryId) : "vegetables";

  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [activeCategory, setActiveCategory] = useState<ShopCategoryId>(preferredCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const initialScrollDone = useRef(false);

  useEffect(() => setSearch(initialQuery), [initialQuery]);

  useEffect(() => {
    const sections = shopCategories
      .map((category) => document.getElementById(category.id))
      .filter((s): s is HTMLElement => Boolean(s));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveCategory(visible.target.id as ShopCategoryId);
      },
      { rootMargin: "-24% 0px -56% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialScrollDone.current || !hasInitialCategory) return;
    initialScrollDone.current = true;
    setActiveCategory(preferredCategory);
    window.requestAnimationFrame(() => document.getElementById(preferredCategory)?.scrollIntoView({ block: "start", behavior: "auto" }));
  }, [hasInitialCategory, preferredCategory]);

  const query = search.trim().toLowerCase();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          query.length === 0 ||
          product.name.toLowerCase().includes(query) ||
          product.unit.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          product.origin.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);

        return matchesSearch && matchesFilters([product], activeFilters);
      }),
    [activeFilters, products, query]
  );

  const categorySections = useMemo(
    () =>
      shopCategories.map((category) => ({
        ...category,
        products: sortProducts(filteredProducts.filter((p) => p.category === category.id), sortBy)
      })),
    [filteredProducts, sortBy]
  );

  const visibleSections = useMemo(() => {
    if (!query && activeFilters.length === 0) return categorySections;
    return categorySections.filter((section) => section.products.length > 0);
  }, [activeFilters.length, categorySections, query]);

  const featuredMatches = useMemo(() => sortProducts(filteredProducts, sortBy).slice(0, 3), [filteredProducts, sortBy]);
  const quickSearches = useMemo(() => [...products].sort((l, r) => r.popularity - l.popularity).slice(0, 4).map((p) => p.name), [products]);
  const resultsCount = filteredProducts.length;

  function toggleFilter(filter: FilterOption) {
    setActiveFilters((current) => (current.includes(filter) ? current.filter((i) => i !== filter) : [...current, filter]));
  }

  function clearAllFilters() {
    setActiveFilters([]);
    setSearch("");
  }

  function scrollToCategory(categoryId: ShopCategoryId) {
    setActiveCategory(categoryId);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen" style={{ background: T.forest, fontFamily: T.fonts.sans }}>
      {/* Sticky Header with Search and Filters */}
      <div className="sticky top-[73px] z-30 backdrop-blur-md" style={{ background: `${T.forest}EE` }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: T.creamDim }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-white/10 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                style={{ background: T.forestLight, color: T.cream, fontFamily: T.fonts.sans }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: T.creamDim }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition-all"
                style={{ background: T.forestLight, color: T.cream }}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] text-forest font-bold">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition-all"
                  style={{ background: T.forestLight, color: T.cream }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {sortOpen && (
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 p-2 shadow-xl"
                      style={{ background: T.forestMid }}
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            sortBy === option.value
                              ? "bg-gold/20 text-gold"
                              : "text-cream/70 hover:bg-white/5 hover:text-cream"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden lg:flex items-center rounded-full border border-white/10 p-1" style={{ background: T.forestLight }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    viewMode === "grid" ? "bg-gold/20 text-gold" : "text-cream/50 hover:text-cream"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    viewMode === "list" ? "bg-gold/20 text-gold" : "text-cream/50 hover:text-cream"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeFilters.length > 0 || search) && (
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm" style={{ color: T.creamDim }}>Active:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1 text-xs font-medium text-gold">
                    Search: {search}
                    <button onClick={() => setSearch("")} className="ml-1 hover:text-goldLight">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {activeFilters.map((filter) => {
                  const filterOption = filterOptions.find((f) => f.value === filter);
                  return (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1 text-xs font-medium text-gold"
                    >
                      {filterOption?.label}
                      <button onClick={() => toggleFilter(filter)} className="ml-1 hover:text-goldLight">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-gold hover:text-goldLight underline"
                >
                  Clear all
                </button>
              </div>
              <span className="text-sm" style={{ color: T.creamDim }}>{resultsCount} results</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-8">
        {/* Category Navigation Tabs */}
        <div className="sticky top-[180px] z-20 -mx-6 px-6 mb-8 lg:top-[190px]">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {shopCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-all",
                    isActive
                      ? "bg-gold text-forest shadow-lg"
                      : "border border-white/10 text-cream/60 hover:border-gold/50 hover:text-gold"
                  )}
                  style={{ 
                    background: isActive ? T.gold : T.forestLight,
                    fontFamily: T.fonts.sans 
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {resultsCount > 0 && (query || activeFilters.length > 0) ? (
          <section className="mt-8">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <SectionLabel>Search Results</SectionLabel>
                  <h2 className="mt-3 leading-[1.05]" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: T.cream }}>
                    Best matches for you
                  </h2>
                </div>
                <p className="text-sm" style={{ color: T.creamDim }}>{resultsCount} products found</p>
              </div>
            </Reveal>

            <div className={cn(
              "mt-6 gap-4",
              viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"
            )}>
              {featuredMatches.map((product, index) => (
                <ShopProductCard key={product.id} product={product} priority={index === 0} />
              ))}
            </div>
          </section>
        ) : null}

        {resultsCount === 0 ? (
          <section className="mt-8 rounded-2xl border border-white/10 px-6 py-16 text-center" style={{ background: T.forestMid }}>
            <Reveal>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full" style={{ background: T.forestLight }}>
                <Search className="h-10 w-10" style={{ color: T.sage }} />
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: T.gold, fontFamily: T.fonts.sans }}>No matches found</p>
              <h2 className="mt-3 leading-tight" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: T.cream }}>
                Nothing matches this search yet.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed" style={{ color: T.creamDim, fontFamily: T.fonts.sans }}>
                Try a simpler product name or remove some filters to see more products.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {quickSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearch(term);
                      setActiveFilters([]);
                    }}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-gold/50 hover:text-gold"
                    style={{ background: T.forestLight, color: T.cream, fontFamily: T.fonts.sans }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </Reveal>
          </section>
        ) : (
          <div className="mt-8 space-y-16">
            {visibleSections.map((section) => {
              const Icon = categoryIcons[section.id];

              return (
                <section key={section.id} id={section.id} className="scroll-mt-48">
                  <Reveal>
                    <div className="flex flex-col gap-6 pb-8" style={{ borderBottom: `1px solid ${T.forestLight}` }}>
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: T.forestLight, border: `1px solid ${T.gold}/20` }}>
                          <Icon className="h-6 w-6" style={{ color: T.gold }} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: T.gold, fontFamily: T.fonts.sans }}>{section.title}</p>
                          <h2 className="leading-[1.05]" style={{ fontFamily: T.fonts.serif, fontWeight: 300, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: T.cream }}>{section.subtitle}</h2>
                        </div>
                      </div>
                      <p className="max-w-2xl text-base leading-relaxed" style={{ color: T.creamDim, fontFamily: T.fonts.sans }}>{section.blurb}</p>
                      <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold w-fit" style={{ color: T.gold, fontFamily: T.fonts.sans }}>
                        {section.products.length} curated picks
                      </div>
                    </div>
                  </Reveal>

                  <div className={cn(
                    "mt-8 gap-4",
                    viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"
                  )}>
                    {section.products.map((product, index) => (
                      <ShopProductCard key={product.id} product={product} priority={section.id === activeCategory && index === 0} />
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