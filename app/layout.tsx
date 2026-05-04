import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
// @ts-ignore: allow side-effect CSS import when type declarations are unavailable
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Analytics } from '@vercel/analytics/react';

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces"
});

export const metadata: Metadata = {
  title: "FreshGo | Delivering Nature's Best",
  description: "FreshGo delivers vegetables, fruits, and pantry essentials across Rawalpindi & Islamabad."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <AppProviders>
          <div id="content">{children}</div>
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
