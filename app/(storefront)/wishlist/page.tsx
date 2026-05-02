import type { Metadata } from "next";

import { WishlistPageClient } from "@/components/storefront/wishlist-page-client";

export const metadata: Metadata = {
  title: "Wishlist | FreshGo"
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
