"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck
} from "lucide-react";

import { getCategoryById } from "@/data/shop-catalog";
import { useStore } from "@/lib/store/store-provider";
import { buildWhatsAppOrderUrl, formatPrice, getDiscountPercent } from "@/lib/storefront";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";

export function ProductDetailView({ slug }: { slug: string }) {
  const { products, cart, addToCart, toggleWishlist, wishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((entry) => entry.slug === slug);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter((entry) => entry.category === product.category && entry.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Product</p>
        <h1 className="mt-4 font-display text-4xl text-ink">This product is not available right now.</h1>
        <p className="mt-4 text-base text-ink/68">
          Browse the main catalog to continue shopping from the current grocery selection.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
        >
          Back to shop
        </Link>
      </section>
    );
  }

  const category = getCategoryById(product.category);
  const isWishlisted = wishlist.includes(product.id);
  const discount = getDiscountPercent(product);
  const cartQuantity = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
  const estimatedTotal = product.price * quantity;
  const whatsappHref = buildWhatsAppOrderUrl({
    items: [{ name: product.name, quantity, unit: product.unit }],
    total: estimatedTotal,
    city: "Rawalpindi / Islamabad",
    area: "Share your area in chat"
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/55">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-brand-700">
              {category?.title ?? "Shop"}
            </Link>
            <span>/</span>
            <span className="font-medium text-ink">{product.name}</span>
          </div>

          <div className="overflow-hidden rounded-[2.2rem] bg-white shadow-soft">
            <div className="relative aspect-square sm:aspect-[16/12] overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,32,24,0.03),rgba(18,32,24,0.2))]" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-800 shadow-sm">
                  {category?.title ?? "Fresh pick"}
                </span>
                {discount ? (
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-sm">
                    {discount}% off
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-panel rounded-[1.7rem] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Origin</p>
              <p className="mt-3 text-sm font-medium text-ink">{product.origin}</p>
            </div>
            <div className="surface-panel rounded-[1.7rem] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Unit</p>
              <p className="mt-3 text-sm font-medium text-ink">{product.unit}</p>
            </div>
            <div className="surface-panel rounded-[1.7rem] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Inventory</p>
              <p className="mt-3 text-sm font-medium text-ink">{product.inventory} available</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white px-6 py-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">What to expect</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Selected for everyday household use.</h2>
            <p className="mt-4 text-base leading-7 text-ink/68">{product.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-cream px-5 py-5">
                <p className="text-sm font-semibold text-ink">Why shoppers choose this</p>
                <ul className="mt-3 space-y-2 text-sm text-ink/68">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] bg-cream px-5 py-5">
                <p className="text-sm font-semibold text-ink">Buying confidence</p>
                <div className="mt-3 space-y-3 text-sm text-ink/68">
                  <p>Units stay clear so customers know exactly what will arrive.</p>
                  <p>Savings are shown next to the main price when a discount is active.</p>
                  <p>Local delivery and COD keep the order path familiar and predictable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="self-start rounded-[2.2rem] bg-white px-6 py-6 shadow-soft lg:sticky lg:top-28">
          <div className="flex flex-wrap items-center gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-brand-100 bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink/75"
              >
                {badge}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-4xl leading-tight text-ink">{product.name}</h1>
          <p className="mt-3 text-base leading-7 text-ink/66">{product.shortDescription}</p>

          <div className="mt-6 flex items-end gap-3">
            <p className="text-3xl font-bold text-ink">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-base text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</p>
            ) : null}
            {discount ? (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-ink">
                {discount}% off
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-ink/58">Per {product.unit}</p>

          <div className="mt-6 flex items-center justify-between rounded-[1.5rem] bg-brand-50 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-ink">Estimated item total</p>
              <p className="mt-1 text-sm text-ink/58">
                {quantity} x {product.unit}
              </p>
            </div>
            <p className="text-lg font-semibold text-ink">{formatPrice(estimatedTotal)}</p>
          </div>

          {cartQuantity > 0 ? (
            <div className="mt-4 rounded-[1.4rem] border border-brand-100 bg-white px-4 py-3 text-sm text-ink/70">
              You already have {cartQuantity} in your cart.
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-brand-100 bg-cream p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="inline-flex min-w-12 items-center justify-center text-sm font-semibold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product.id, quantity)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors",
                isWishlisted ? "border-brand-600 bg-brand-600 text-white" : "border-brand-100 bg-cream text-ink"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-white" : "")} />
            </button>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-400"
          >
            Confirm on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-6 space-y-4 border-t border-brand-100 pt-6">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Fast local delivery</p>
                <p className="mt-1 text-sm text-ink/62">Serving Rawalpindi and Islamabad households.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Cash on delivery</p>
                <p className="mt-1 text-sm text-ink/62">Payment stays simple and familiar at the doorstep.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Clear product signals</p>
                <p className="mt-1 text-sm text-ink/62">Badges, savings, and units stay visible while buying.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] bg-brand-50 px-5 py-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
              Popularity score {product.popularity}
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/66">
              A strong everyday choice for repeat household shopping.
            </p>
          </div>
        </aside>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">You may also like</p>
              <h2 className="mt-2 font-display text-4xl text-ink">More from {category?.title ?? "this aisle"}</h2>
            </div>
            <Link href={`/shop?category=${product.category}`} className="text-sm font-semibold text-brand-700">
              Explore the aisle
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
