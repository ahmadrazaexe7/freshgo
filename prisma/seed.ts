import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  await prisma.product.createMany({
    data: [
      {
        name: "Organic Spinach",
        slug: "organic-spinach",
        description: "Tender, leafy spinach cleaned and packed for same-day cooking.",
        price: "180.00",
        salePrice: "150.00",
        unit: "bundle",
        inventory: 60,
        featured: true,
        categoryId: categories[0].id,
        image: "/images/products/spinach.jpg",
        gallery: ["/images/products/spinach.jpg"]
      },
      {
        name: "Kinnow Citrus Box",
        slug: "kinnow-citrus-box",
        description: "Sweet and juicy kinnows packed in a family-size box.",
        price: "950.00",
        unit: "5kg",
        inventory: 24,
        featured: true,
        categoryId: categories[1].id,
        image: "/images/products/kinnow.jpg",
        gallery: ["/images/products/kinnow.jpg"]
      },
      {
        name: "Premium Basmati Rice",
        slug: "premium-basmati-rice",
        description: "Long-grain basmati rice ideal for biryani and pulao.",
        price: "780.00",
        unit: "2kg",
        inventory: 34,
        featured: false,
        categoryId: categories[2].id,
        image: "/images/products/rice.jpg",
        gallery: ["/images/products/rice.jpg"]
      }
    ],
    skipDuplicates: true
  });
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

