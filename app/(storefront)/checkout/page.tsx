import type { Metadata } from "next";

import { CheckoutPageClient } from "@/components/storefront/checkout-page-client";

export const metadata: Metadata = {
  title: "Checkout | FreshGo"
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
