import type { ProductBadge, ShopCategoryId, ShopProduct } from "@/data/shop-catalog";

export const WHATSAPP_ORDER_NUMBER = "923363629981";

export const badgeStyles: Record<ProductBadge, string> = {
  Fresh: "bg-white/95 text-brand-800",
  "Best Seller": "bg-ink/92 text-white",
  Discount: "bg-brand-600 text-white"
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(value);
}

export function slugToLabel(value: string) {
  return value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export function getDeliveryFee(city: string, subtotal: number) {
  if (subtotal >= 3000) {
    return 0;
  }

  return city === "Islamabad" ? 220 : 170;
}

export function buildWhatsAppOrderUrl({
  items,
  total,
  city,
  area
}: {
  items: Array<{ name: string; quantity: number; unit: string }>;
  total: number;
  city: string;
  area: string;
}) {
  const lines = [
    "Hello FreshGo, I would like to confirm this order:",
    "",
    ...items.map((item) => `- ${item.name} x${item.quantity} (${item.unit})`),
    "",
    `Delivery area: ${area}, ${city}`,
    `Estimated total: ${formatPrice(total)}`
  ];

  return `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function getDiscountPercent(product: Pick<ShopProduct, "price" | "compareAtPrice">) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return null;
  }

  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}

export function byCategory(products: ShopProduct[], categoryId: ShopCategoryId) {
  return products.filter((product) => product.category === categoryId);
}
