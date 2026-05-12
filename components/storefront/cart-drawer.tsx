"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, Trash2 } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";
import { formatPrice, getDeliveryFee } from "@/lib/storefront";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Quick cart</p>
                <h2 className="text-xl font-semibold text-slate-900">Checkout drawer</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
              {items.length === 0 ? (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-slate-600">Your cart is empty. Add a few fresh items to start.</p>
                  <Link href="/shop" onClick={onClose} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                    Browse products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 rounded-3xl border border-slate-200 p-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-slate-100">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="h-full w-full bg-slate-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[40px] text-center text-sm font-semibold text-slate-900">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-200 px-5 py-5">
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <Link href="/checkout" onClick={onClose} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                    Go to checkout
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                  >
                    Clear basket
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
