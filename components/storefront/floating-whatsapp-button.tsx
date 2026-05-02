"use client";

import { MessageCircle } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";
import { buildWhatsAppOrderUrl } from "@/lib/storefront";

export function FloatingWhatsAppButton() {
  const { cart, products } = useStore();

  const items = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        return null;
      }

      return {
        name: product.name,
        quantity: item.quantity,
        unit: product.unit
      };
    })
    .filter((item): item is { name: string; quantity: number; unit: string } => Boolean(item));

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const href =
    items.length > 0
      ? buildWhatsAppOrderUrl({
          items,
          total,
          city: "Rawalpindi / Islamabad",
          area: "Share your area in chat"
        })
      : "https://wa.me/923001234567?text=Hello%20Fresh%20Home%20Mart%2C%20I%20would%20like%20to%20place%20an%20order.";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#22c55e] px-4 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-1"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp Order
    </a>
  );
}
