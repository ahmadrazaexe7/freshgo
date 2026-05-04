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
      <section className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 lg:px-8 py-8 sm:py-16 text-center">
        <div className="rounded-lg sm:rounded-2xl lg:rounded-[2rem] bg-white p-6 sm:p-8 lg:p-10 shadow-soft">
          <div className="mx-auto flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShoppingBasket className="h-5 sm:h-7 w-5 sm:w-7" />
          </div>
          <h1 className="mt-4 sm:mt-6 font-display text-2xl sm:text-3xl lg:text-4xl text-ink">Your cart is empty.</h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-ink/66">
            Add vegetables, fruits, or groceries from the shop to start building your next delivery.
          </p>
          <Link
            href="/shop"
            className="mt-6 sm:mt-8 inline-flex rounded-full bg-brand-600 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-soft hover:shadow-lg transition-shadow"
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid gap-4 sm:gap-6 lg:gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg sm:rounded-2xl lg:rounded-[2rem] bg-white p-3 sm:p-4 lg:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Cart</p>
              <h1 className="mt-1 sm:mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-ink">Review your basket</h1>
            </div>
            <button type="button" onClick={clearCart} className="text-xs sm:text-sm font-semibold text-ink/58 hover:text-brand-700 whitespace-nowrap">
              Clear all
            </button>
          </div>

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {items.map(({ product, quantity }) => (
              <article key={product.id} className="flex flex-col gap-3 sm:gap-4 rounded-lg sm:rounded-xl lg:rounded-[1.6rem] border border-brand-100 bg-cream p-3 sm:p-4 shadow-lg hover:shadow-2xl transition-shadow sm:flex-row sm:items-center">
                <div className="relative h-20 sm:h-24 w-full overflow-hidden rounded-lg sm:rounded-[1.25rem] bg-white sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.slug}`} className="text-base sm:text-lg font-semibold text-ink hover:text-brand-700 line-clamp-2 sm:line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-ink/62 line-clamp-1">{product.shortDescription}</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-brand-700">{product.unit}</p>
                </div>
                <div className="flex items-center justify-between gap-2 sm:gap-4 sm:flex-col sm:items-end">
                  <div className="inline-flex items-center rounded-full border border-brand-100 bg-white p-0.5 sm:p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="inline-flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-full text-ink text-xs sm:text-base"
                    >
                      <Minus className="h-3 sm:h-4 w-3 sm:w-4" />
                    </button>
                    <span className="inline-flex min-w-7 sm:min-w-10 items-center justify-center text-xs sm:text-sm font-semibold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="inline-flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-full text-ink text-xs sm:text-base"
                    >
                      <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-ink">{formatPrice(product.price * quantity)}</p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="mt-1 sm:mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-ink/58 hover:text-red-600"
                    >
                      <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-lg sm:rounded-2xl lg:rounded-[2rem] bg-gradient-to-b from-brand-900 to-emerald-700 p-4 sm:p-5 lg:p-6 text-white shadow-xl">
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-brand-200">Order summary</p>
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/78">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4 text-sm sm:text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 rounded-lg sm:rounded-xl lg:rounded-[1.5rem] bg-white/8 p-3 sm:p-4 text-xs sm:text-sm text-white/74">
            Orders above {formatPrice(3000)} unlock free delivery. COD is available on all orders.
          </div>

          <Link
            href="/checkout"
            className="mt-4 sm:mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-ink shadow-md hover:shadow-xl transition-shadow"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/shop"
            className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/5 transition-colors"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}