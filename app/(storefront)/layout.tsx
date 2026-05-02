import React, { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingWhatsAppButton } from "@/components/storefront/floating-whatsapp-button";
import { ActionToast } from "@/components/shared/action-toast";

export default function StorefrontLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div />}> 
        <SiteHeader />
      </Suspense>
      <main>{children}</main>
      <ActionToast />
      <FloatingWhatsAppButton />
      <SiteFooter />
    </div>
  );
}
