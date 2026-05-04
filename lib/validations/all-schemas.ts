import { z } from "zod";

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(120),
  slug: z.string().min(1, "Slug is required").max(140),
  description: z.string().min(10, "Description must be at least 10 characters"),
  unit: z.string().min(1, "Unit is required").max(20),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional().nullable(),
  inventory: z.number().int().min(0, "Inventory cannot be negative"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  image: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.compareAtPrice && data.price && data.compareAtPrice <= data.price) {
      return false;
    }
    return true;
  },
  {
    message: "Compare at price must be greater than sale price",
    path: ["compareAtPrice"],
  }
);

// Auth validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Checkout validation
export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^92\d{10}$/, "Invalid Pakistan phone number (format: 923XXXXXXXXX)"),
  city: z.enum(["Rawalpindi", "Islamabad"], { errorMap: () => ({ message: "Invalid city" }) }),
  area: z.string().min(1, "Area is required").max(100),
  addressLine: z.string().min(5, "Address is required").max(200),
  notes: z.string().max(500).optional(),
});

// Cart item validation
export const cartItemSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Maximum 99 items per product"),
});
