import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const sort = searchParams.get("sort") ?? "popularity";

  try {
    // Build where clause
    const where: any = {};

    if (category) {
      const dbCategory = await db.category.findUnique({
        where: { slug: category }
      });
      if (dbCategory) {
        where.categoryId = dbCategory.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    // Build order by
    let orderBy: any = { featured: "desc" };
    
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { featured: "desc" };
    }

    const products = await db.product.findMany({
      where,
      orderBy,
      include: {
        category: true
      }
    });

    return Response.json({
      ok: true,
      total: products.length,
      products
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return Response.json({ ok: false, message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Create product in database
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        unit: body.unit,
        inventory: parseInt(body.inventory),
        featured: body.featured ?? false,
        published: body.published ?? true,
        categoryId: body.categoryId
      }
    });

    return Response.json({
      ok: true,
      message: "Product created successfully",
      product
    });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return Response.json({ ok: false, message: "Failed to create product" }, { status: 500 });
  }
}
