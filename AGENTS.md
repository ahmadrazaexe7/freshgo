# FreshGo AI Agent Customization Guide

This file helps AI coding agents understand the FreshGo codebase structure, conventions, and best practices for productive development.

## 🏗️ Project Overview

**FreshGo** is a Next.js 15 e-commerce platform for premium grocery delivery in Rawalpindi and Islamabad, Pakistan.

- **Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth v5
- **Package Manager**: npm
- **Build System**: Next.js built-in
- **Deployment**: Vercel (primary) / Railway / VPS

## 📁 Core Architecture

### Route Organization (App Router with Route Groups)

Routes are organized by domain using route groups:

```
app/
├── (auth)/          # Authentication flows
│   ├── login/
│   └── signup/
├── (account)/       # User account management (protected)
│   └── orders/
├── (storefront)/    # Public customer-facing pages
│   ├── page.tsx     # Home
│   ├── shop/
│   ├── products/[slug]/
│   ├── cart/
│   ├── checkout/
│   └── wishlist/
├── admin/           # Admin dashboard (protected)
├── api/             # REST API endpoints
│   ├── auth/[...nextauth]/
│   ├── products/
│   ├── orders/
│   └── streak/
```

**Key Pattern**: Route groups use parentheses `(groupName)` and are NOT part of the URL. Use this for logically grouping related pages.

### Component Organization

```
components/
├── auth/            # Login, signup panels
├── storefront/      # Product cards, cart, checkout
├── account/         # Order history, account
├── admin/           # Admin dashboard
├── layout/          # Header, footer, modals
└── shared/          # Generic reusable components
```

### Database & Data Layer

- **ORM**: Prisma (see [prisma/schema.prisma](prisma/schema.prisma))
- **Database**: PostgreSQL
- **Key Models**: User, Product, Category, Order, OrderItem, WishlistItem, Account, Session
- **Authentication**: NextAuth v5 with Prisma adapter

## 🎯 Development Workflow

### Initial Setup

```bash
npm ci
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run ci` | Lint + build (CI pipeline) |
| `npm run prisma:migrate` | Create database migrations |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:studio` | GUI for database inspection |
| `npm run seed` | Seed database with initial data |

### Environment Variables (Required)

See `.env.example` for template. Required for production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000 or production domain)
- `WHATSAPP_ORDER_NUMBER` - Phone number for order notifications (default in constants)

## 🔐 Authentication Architecture

**Framework**: NextAuth v5 with Prisma adapter and credentials provider

- **Session Strategy**: JWT
- **Sign-in Page**: `/login`
- **Protected Routes**: Use `auth()` from `lib/auth.ts` to check session
- **Admin Role**: Role-based access control via `User.role` (CUSTOMER | ADMIN)

**Key File**: [lib/auth.ts](lib/auth.ts)

Example usage:
```typescript
import { auth } from "@/lib/auth";
const session = await auth();
if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
```

## 💾 Database Schema

All models are in [prisma/schema.prisma](prisma/schema.prisma). Key relationships:

- **User** → Orders (1:many), Sessions, Accounts, WishlistItems
- **Product** → Category (many:1), OrderItems (1:many), WishlistItems (1:many)
- **Order** → User (many:1), OrderItems (1:many)

**Order Workflow States**: PENDING → CONFIRMED → PACKING → OUT_FOR_DELIVERY → DELIVERED (or CANCELLED)

## 🛠️ Common Development Patterns

### 1. Adding a New API Endpoint

Place in `app/api/[resource]/route.ts` following this pattern:

```typescript
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  // Protect admin endpoints
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  const data = await db.product.findMany();
  return Response.json(data);
}
```

### 2. Adding Database Fields

1. Modify `prisma/schema.prisma`
2. Run: `npm run prisma:migrate` (creates migration file)
3. Run: `npm run prisma:generate` (regenerates Prisma client)

### 3. Creating a New Page

1. Create file in appropriate route group: `app/(groupName)/newpage/page.tsx`
2. Server component by default (async allowed)
3. Use layouts (`layout.tsx`) for shared structure within route group

### 4. Product Management

- Catalog data: [data/shop-catalog.ts](data/shop-catalog.ts)
- Product validation: [lib/validations/product.ts](lib/validations/product.ts)
- Database: Products stored in `prisma/schema.prisma`
- **Pricing Helpers**: Use `formatPrice()` from [lib/storefront.ts](lib/storefront.ts) for consistent PKR formatting

### 5. Validations

Use Zod schemas in `lib/validations/`. Example:

```typescript
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  price: z.number().min(0),
  // ... other fields
});
```

## 📍 Key Utilities & Constants

- **Delivery Cities**: Rawalpindi, Islamabad (type: `DeliveryCity`)
- **Delivery Fee Logic**: [lib/storefront.ts](lib/storefront.ts) - `getDeliveryFee(city, subtotal)`
- **WhatsApp Integration**: `buildWhatsAppOrderUrl()` creates order message for WhatsApp
- **Price Formatting**: `formatPrice(number)` returns PKR currency format
- **Slug Conversion**: `slugToLabel(string)` converts kebab-case to Title Case

## 🚀 Deployment

**Primary**: Vercel (recommended). Environment variables and database connection configured in Vercel dashboard.

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions for:
- Vercel
- Railway
- Self-hosted VPS

**Build Command**: `npm run build` (runs `prisma generate && next build`)

## ⚠️ Common Pitfalls & Tips

1. **Prisma Migrations**: Always run `npm run prisma:migrate` after schema changes, not direct SQL
2. **Server vs Client**: Use `"use client"` only when needed (event handlers, hooks). Default to Server Components
3. **Image Paths**: Only Unsplash images are whitelisted in `next.config.mjs`. Add new domains as needed
4. **Protected Routes**: Always check `session?.user?.role` for admin pages; use `auth()` from `lib/auth.ts`
5. **Environment Variables**: All required variables must be set before `npm run dev` or build will fail
6. **SKU/Unit Management**: Products use flexible `unit` field (e.g., "1kg", "dozen", "500g")

## 📚 Documentation Links

- [Project Structure](./docs/project-structure.md)
- [Production Readiness Guide](./PRODUCTION_READY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Tailwind Config](./tailwind.config.ts)
- [Next.js Config](./next.config.mjs)

## 🔄 Development Cycle

1. Create a feature branch
2. Run `npm run dev` for hot-reload development
3. Run `npm run lint` to check code quality
4. Run `npm run build` to verify production build
5. Commit and open PR
6. CI pipeline runs `npm run ci` (lint + build) automatically

---

**Version**: 1.0 | **Last Updated**: May 2026
