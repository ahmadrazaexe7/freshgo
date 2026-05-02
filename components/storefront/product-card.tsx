"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingCart, Star, Truck, Zap } from "lucide-react";

import { getCategoryById, type ShopProduct } from "@/data/shop-catalog";
import { useStore } from "@/lib/store/store-provider";
import { badgeStyles, formatPrice, getDiscountPercent } from "@/lib/storefront";
import { cn } from "@/lib/utils";

// Create typed motion components
const MotionArticle = motion.article as unknown as React.ComponentType<any>;
const MotionButton = motion.button as unknown as React.ComponentType<any>;
const MotionDiv = motion.div as unknown as React.ComponentType<any>;

type ProductCardProps = {
  product: ShopProduct;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();
  const category = getCategoryById(product.category);
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = getDiscountPercent(product);
  const cartItem = cart.find((item) => item.productId === product.id);
  const isInCart = Boolean(cartItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[2rem] border border-brand-100/50 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-brand-100/50"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/4.5] overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100/30">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm",
                badgeStyles[badge]
              )}
            >
              {badge}
            </span>
          ))}
          {discountPercent && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-ink shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <MotionButton
          type="button"
          onClick={handleWishlist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all",
            isWishlisted
              ? "bg-brand-600 text-white shadow-brand-200"
              : "bg-white/90 text-ink/60 backdrop-blur-sm hover:bg-white hover:text-brand-600"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4 transition-all", isWishlisted && "fill-white")} />
        </MotionButton>

        {/* Quick Add to Cart Overlay */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-0 p-3"
        >
          <MotionButton
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full rounded-full py-3 text-sm font-bold uppercase tracking-[0.1em] shadow-lg transition-all",
              isInCart
                ? "bg-brand-700 text-white"
                : "bg-white text-ink shadow-brand-100/50 hover:bg-brand-600 hover:text-white"
            )}
          >
            {isInCart ? (
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                In Cart ({cartItem?.quantity})
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </span>
            )}
          </MotionButton>
        </MotionDiv>
      </div>

      {/* Product Info Section */}
      <div className="space-y-3 p-4">
        {/* Category & Unit */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">
              {category?.title ?? "Fresh Pick"}
            </p>
            <Link href={`/products/${product.slug}`} className="block mt-1">
              <h3 className="line-clamp-2 text-base font-bold text-ink transition-colors group-hover:text-brand-700">
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-700">
            {product.unit}
          </span>
        </div>

        {/* Short Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-ink/60">
          {product.shortDescription}
        </p>

        {/* Delivery & Stock Info */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-medium text-brand-700">
            <Truck className="h-3 w-3" />
            {product.inventory > 20 ? "Ready today" : `Only ${product.inventory} left`}
          </span>
          {product.popularity > 90 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700">
              <Zap className="h-3 w-3" />
              Hot
            </span>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black text-ink">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-sm text-ink/40 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
            <p className="mt-0.5 text-[10px] text-ink/50">Origin: {product.origin}</p>
          </div>

          {/* Popularity Score */}
          <div className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-ink">{product.popularity}</span>
          </div>
        </div>

        {/* View Product Link */}
        <Link
          href={`/products/${product.slug}`}
          className="group/link mt-3 flex items-center justify-between rounded-full bg-cream px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition-all hover:bg-brand-600 hover:text-white"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </MotionArticle>
  );
}