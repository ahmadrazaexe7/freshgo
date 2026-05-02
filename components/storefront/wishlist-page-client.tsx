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
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Heart className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink">Your wishlist is empty.</h1>
          <p className="mt-3 text-base leading-7 text-ink/66">
            Save products here to build your next weekly restock more quickly.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Explore products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Wishlist</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Saved products for later</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-ink/66">
        Keep your regular essentials and favorite seasonal picks together for faster repeat orders.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
