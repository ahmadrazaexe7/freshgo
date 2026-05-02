import type { Metadata } from "next";

import { CartPageClient } from "@/components/storefront/cart-page-client";

export const metadata: Metadata = {
  title: "Your cart | FreshGo"
};

export default function CartPage() {
  return <CartPageClient />;
}
