import type { Metadata } from "next";

import { shopCategories, type ShopCategoryId } from "@/data/shop-catalog";
import { ShopCatalog } from "@/components/storefront/shop-catalog";

export const metadata: Metadata = {
  title: "Shop Fresh Groceries | FreshGo",
  description:
    "Browse premium vegetables, fruits, and groceries with search, sorting, filters, and fast delivery across Rawalpindi and Islamabad."
};

type ShopPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q = "", category } = await searchParams;
  const initialCategory = shopCategories.some((item) => item.id === category)
    ? (category as ShopCategoryId)
    : undefined;

  return <ShopCatalog initialQuery={q} initialCategory={initialCategory} />;
}
