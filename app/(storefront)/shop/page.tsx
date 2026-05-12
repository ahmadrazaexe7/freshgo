import { Suspense } from "react";
import type { Metadata } from "next";
import { shopCategories, type ShopCategoryId } from "@/data/shop-catalog";
import ShopCatalogServer from "@/components/storefront/shop-catalog-server";
import { ProductGridSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Shop Fresh Groceries | FreshGo",
  description: "Browse premium vegetables and fruits with fast delivery in RWP/ISB."
};

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

async function fetchProductsFromApi() {
  try {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      // Cache for 1 hour in production, 30 seconds in development
      next: { revalidate: process.env.NODE_ENV === "production" ? 3600 : 30 }
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return [];
    }

    const payload = await res.json();
    const products = Array.isArray(payload?.products) ? payload.products : [];
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function ProductGallery({ searchParams }: ShopPageProps) {
  const { q = "", category } = await searchParams;
  const initialCategory = shopCategories.some((item) => item.id === category)
    ? (category as ShopCategoryId)
    : undefined;

  const serverProducts = await fetchProductsFromApi();

  return (
    <ShopCatalogServer products={serverProducts} initialQuery={q} initialCategory={initialCategory} />
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <main className="min-h-screen bg-[#0B1F12] pb-20">
      <Suspense fallback={<ProductGridSkeleton />}>
        <section className="container mx-auto px-4 pt-6">
          <header className="mb-8 space-y-2 text-white">
            <p className="text-sm uppercase tracking-[0.26em] text-[#C9A84C]">Curated weekly</p>
            <h1 className="text-3xl font-serif font-bold md:text-4xl">Farm-fresh groceries, ready to ship.</h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Rapid server-rendered shopping for premium produce with a clean, mobile-first experience.
            </p>
          </header>

          <ProductGallery searchParams={searchParams} />
        </section>
      </Suspense>
    </main>
  );
}