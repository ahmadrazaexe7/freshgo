import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { shopProducts } from "../data/shop-catalog";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 10);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "vegetables" },
      update: {},
      create: {
        name: "Vegetables",
        slug: "vegetables",
        description: "Daily fresh vegetables sourced for home kitchens."
      }
    }),
    prisma.category.upsert({
      where: { slug: "fruits" },
      update: {},
      create: {
        name: "Fruits",
        slug: "fruits",
        description: "Seasonal and imported fruits for families and gifting."
      }
    }),
    prisma.category.upsert({
      where: { slug: "groceries" },
      update: {},
      create: {
        name: "Groceries",
        slug: "groceries",
        description: "Pantry staples, grains, oils, and everyday essentials."
      }
    })
  ]);

  await prisma.user.upsert({
    where: { email: "admin@freshhomemart.pk" },
    update: {},
    create: {
      name: "FreshGo Admin",
      email: "admin@freshhomemart.pk",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+92 300 1234567"
    }
  });

  // Seed all products from the local shop catalog
  const productsToSeed = shopProducts
    .map((p) => {
      const category = categories.find((c) => c.slug === p.category);
      if (!category) return null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || p.shortDescription || "",
        price: String(typeof p.price === "number" ? p.price.toFixed(2) : p.price),
        salePrice: p.compareAtPrice ? String(p.compareAtPrice.toFixed(2)) : null,
        unit: p.unit || "",
        inventory: typeof p.inventory === "number" ? p.inventory : 0,
        featured: (p.badges || []).includes("Best Seller") || (p.bestSellerScore || 0) > 90,
        published: true,
        categoryId: category.id,
        image: p.image || null,
        gallery: p.image ? [p.image] : []
      } as any;
    })
    .filter(Boolean) as Array<any>;

  if (productsToSeed.length) {
    // Use createMany with skipDuplicates to avoid duplicate entries
    await prisma.product.createMany({
      data: productsToSeed,
      skipDuplicates: true
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

