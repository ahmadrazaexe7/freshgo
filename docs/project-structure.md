# Project Structure

```text
fresh_mart/
|-- app/
|   |-- (auth)/login/page.tsx
|   |-- (account)/orders/page.tsx
|   |-- (storefront)/
|   |   |-- cart/page.tsx
|   |   |-- checkout/page.tsx
|   |   |-- products/[slug]/page.tsx
|   |   |-- shop/page.tsx
|   |   |-- wishlist/page.tsx
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- admin/page.tsx
|   |-- api/
|   |   |-- auth/[...nextauth]/route.ts
|   |   |-- orders/route.ts
|   |   |-- orders/[id]/route.ts
|   |   |-- products/route.ts
|   |   `-- products/[id]/route.ts
|   |-- globals.css
|   `-- layout.tsx
|-- components/
|   |-- admin/
|   |-- auth/
|   |-- layout/
|   |-- shared/
|   |-- storefront/
|   `-- ui/
|-- data/
|   `-- navigation.ts
|-- docs/
|   `-- project-structure.md
|-- lib/
|   |-- actions/
|   |-- store/
|   |-- validations/
|   |   `-- product.ts
|   |-- auth.ts
|   |-- constants.ts
|   |-- db.ts
|   `-- utils.ts
|-- prisma/
|   |-- schema.prisma
|   `-- seed.ts
|-- providers/
|   `-- app-providers.tsx
|-- public/
|   `-- images/products/
|-- types/
|   `-- index.ts
|-- .env.example
|-- next.config.mjs
|-- package.json
|-- postcss.config.mjs
`-- tailwind.config.ts
```

## Route Intent

- `(storefront)`: customer-facing shopping experience
- `(auth)`: sign-in flow
- `(account)`: order history and account management
- `admin`: product and order operations
- `api`: CRUD and auth endpoints

## Next Build Steps

1. Replace placeholders with production-ready product grids, filters, checkout forms, and admin tables.
2. Connect Prisma models to real API route handlers and server actions.
3. Add NextAuth session handling, protected admin routes, and order workflows.
4. Seed PostgreSQL with realistic categories, products, and admin credentials.

