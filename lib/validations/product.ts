import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  description: z.string().min(20),
  categoryId: z.string().cuid(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  unit: z.string().min(1).max(20),
  inventory: z.number().int().min(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true)
});

