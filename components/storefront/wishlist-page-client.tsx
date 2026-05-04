"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductCard } from "@/components/storefront/product-card";
import { useStore } from "@/lib/store/store-provider";

export function WishlistPageClient() {
  const { wishlist, products } = useStore();
  const wishlistProducts = wishlist
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is (typeof products)[number] => Boolean(product));

  if (wishlistProducts.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 lg:px-8 py-8 sm:py-16 text-center">
        <div className="rounded-lg sm:rounded-2xl lg:rounded-[2rem] bg-white p-6 sm:p-8 lg:p-10 shadow-soft">
          <div className="mx-auto flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Heart className="h-5 sm:h-7 w-5 sm:w-7" />
          </div>
          <h1 className="mt-4 sm:mt-6 font-display text-2xl sm:text-3xl lg:text-4xl text-ink">Your wishlist is empty.</h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-ink/66">
            Save products here to build your next weekly restock more quickly.
          </p>
          <Link
            href="/shop"
            className="mt-6 sm:mt-8 inline-flex rounded-full bg-brand-600 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-soft hover:shadow-lg transition-shadow"
          >
            Explore products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 lg:px-8 py-6 sm:py-10">
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Wishlist</p>
      <h1 className="mt-1 sm:mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-ink">Saved products for later</h1>
      <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-ink/66">
        Keep your regular essentials and favorite seasonal picks together for faster repeat orders.
      </p>

      <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 lg:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
