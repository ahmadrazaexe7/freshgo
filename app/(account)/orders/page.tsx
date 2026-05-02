import type { Metadata } from "next";

import { OrdersPageClient } from "@/components/storefront/orders-page-client";

export const metadata: Metadata = {
  title: "Orders | FreshGo"
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
