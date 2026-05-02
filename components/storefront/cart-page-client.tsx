"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";
import { formatPrice, getDeliveryFee } from "@/lib/storefront";

export function CartPageClient() {
  const { cart, products, updateCartQuantity, removeFromCart, clearCart } = useStore();
  const items = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: (typeof products)[number]; quantity: number } => Boolean(item));

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = getDeliveryFee("Rawalpindi", subtotal);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShoppingBasket className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink">Your cart is empty.</h1>
          <p className="mt-3 text-base leading-7 text-ink/66">
            Add vegetables, fruits, or groceries from the shop to start building your next delivery.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Cart</p>
              <h1 className="mt-2 font-display text-4xl text-ink">Review your basket</h1>
            </div>
            <button type="button" onClick={clearCart} className="text-sm font-semibold text-ink/58 hover:text-brand-700">
              Clear all
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {items.map(({ product, quantity }) => (
              <article key={product.id} className="flex flex-col gap-4 rounded-[1.6rem] border border-brand-100 bg-cream p-4 shadow-lg sm:flex-row sm:items-center hover:shadow-2xl transition-shadow">
                <div className="relative h-24 w-full overflow-hidden rounded-[1.25rem] bg-white sm:w-24">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.slug}`} className="text-lg font-semibold text-ink hover:text-brand-700">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink/62">{product.shortDescription}</p>
                  <p className="mt-2 text-sm font-medium text-brand-700">{product.unit}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="inline-flex items-center rounded-full border border-brand-100 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="inline-flex min-w-10 items-center justify-center text-sm font-semibold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ink">{formatPrice(product.price * quantity)}</p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-ink/58 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] bg-gradient-to-b from-brand-900 to-emerald-700 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-200">Order summary</p>
          <div className="mt-6 space-y-4 text-sm text-white/78">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-white/8 p-4 text-sm text-white/74">
            Orders above {formatPrice(3000)} unlock free delivery. COD is available on all orders.
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink shadow-md hover:shadow-xl"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/90"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
