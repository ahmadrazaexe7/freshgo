"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProductImageProps = Omit<ImageProps, "alt" | "onError" | "src"> & {
  alt: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
  src: string;
};

export function ProductImage({
  alt,
  className,
  fallbackClassName,
  fallbackLabel,
  src,
  ...props
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#effef1,#fff7ed)] text-center text-brand-800",
          props.fill ? "absolute inset-0" : "",
          fallbackClassName
        )}
      >
        <div className="px-4">
          <ImageOff className="mx-auto h-7 w-7" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em]">
            {fallbackLabel ?? "Fresh pick"}
          </p>
        </div>
      </div>
    );
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
