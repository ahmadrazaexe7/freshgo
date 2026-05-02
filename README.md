# FreshGo

FreshGo is a premium grocery ecommerce platform for vegetables, fruits, and daily essentials with delivery across Rawalpindi and Islamabad.

## Production readiness

Quick checklist and commands to prepare for production:

- Run the build and lint checks locally:

```bash
npm ci
npm run lint
npm run build
```

- Lighthouse (run locally against your dev server):

```bash
npx http-server . -p 8080 # or run `npm run start` after build
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

- Accessibility (example using Pa11y):

```bash
npx pa11y http://localhost:3000
```

- Deploying to Vercel:

1. Create a Vercel account and connect the GitHub repository.
2. Set Environment variables in Vercel (e.g., `DATABASE_URL`, `WHATSAPP_ORDER_NUMBER`).
3. Vercel will run the build defined in `package.json` automatically.

CI: A GitHub Actions workflow is included at `.github/workflows/ci.yml` to run lint + build on PRs.

### Logo replacement

To use your provided logo image (recommended as a compressed PNG/WebP at 2x resolution):

1. Save the image file as `public/images/freshgo-logo.png` (or `freshgo-logo.webp`).
2. For best results, provide a square image at 120x120 or 240x240 px and export as WebP.
3. If you want to convert/resize locally, you can use `sharp` (Node) or an image editor:

```bash
npx sharp original.png -resize 240x240 -webp -quality 85 -o public/images/freshgo-logo.webp
```

The header uses Next.js Image and will serve optimized sizes automatically. If you want me to add a favicon or generate multiple sizes, tell me and I will add them.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth

## Project Status

This first pass scaffolds the project structure, route groups, core storefront pages, admin surface, API placeholders, Prisma schema, and seed script.

## Quick Start

```bash
npm.cmd install
copy .env.example .env
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run seed
npm.cmd run dev
```

## Key Areas

- [Project structure](./docs/project-structure.md)
- [Prisma schema](./prisma/schema.prisma)

