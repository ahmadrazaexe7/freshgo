"use client";

import { StoreProvider } from "@/lib/store/store-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <StoreProvider>{children}</StoreProvider>;
}
