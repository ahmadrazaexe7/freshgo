import type { Metadata } from "next";

import { ProductDetailView } from "@/components/storefront/product-detail-view";

export const metadata: Metadata = {
  title: "Product details | FreshGo"
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <ProductDetailView slug={slug} />;
}
