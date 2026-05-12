import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { shopProducts } from "../data/shop-catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting merge seed - will preserve existing products...");

  const adminPassword = await bcrypt.hash("Admin@12345", 10);

  // Upsert categories (won't delete anything)
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

  console.log("✅ Categories ensured");

  // Ensure admin user exists
  await prisma.user.upsert({
    where: { email: "admin@freshhomemart.pk" },
    update: {},
    create: {
      name: "FreshGo Admin",
      email: "admin@freshhomemart.pk",
      password: adminPassword,
      role: "ADMIN",
      phone: "+92 300 1234567"
    }
  });

  console.log("✅ Admin user ensured");

  // Only add products that don't already exist
  let addedCount = 0;
  let skippedCount = 0;

  for (const p of shopProducts) {
    const category = categories.find((c) => c.slug === p.category);
    if (!category) continue;

    try {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {}, // Don't update existing products - preserve user edits
        create: {
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
        }
      });
      addedCount++;
    } catch (e) {
      skippedCount++;
    }
  }

  console.log(`✅ Merge complete: ${addedCount} products added, ${skippedCount} products skipped (already exist)`);

  // Show total product count
  const totalProducts = await prisma.product.count();
  console.log(`📊 Total products in database: ${totalProducts}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed completed successfully!");
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
