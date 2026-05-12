import { db } from "@/lib/db";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const sort = searchParams.get("sort") ?? "popularity";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 1000);
  const skip = Math.max(0, parseInt(searchParams.get("skip") ?? "0"));

  try {
    // Build where clause - only published products by default
    const where: any = {
      published: true
    };

    if (category) {
      // Use the category slug directly if it exists
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    // Build order by
    let orderBy: any = { featured: "desc", createdAt: "desc" };
    
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
      case "popularity":
      default:
        orderBy = { featured: "desc", createdAt: "desc" };
    }

    // Execute both queries in parallel for better performance
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          price: true,
          salePrice: true,
          unit: true,
          inventory: true,
          featured: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }),
      db.product.count({ where })
    ]);

    const response = {
      ok: true,
      total,
      count: products.length,
      products
    };

    // Set cache headers for optimal performance
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": search ? "private, max-age=30" : "public, max-age=300", // 5 min cache for list, 30 sec for search
      "CDN-Cache-Control": "max-age=300"
    };

    return Response.json(response, { headers });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return Response.json(
      { ok: false, message: "Failed to fetch products" },
      { status: 500, headers: { "Cache-Control": "no-cache, no-store" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.price || !body.categoryId) {
      return Response.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product in database
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description ?? "",
        image: body.image ?? null,
        gallery: body.gallery ?? [],
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        unit: body.unit ?? "kg",
        inventory: parseInt(body.inventory ?? "0"),
        featured: body.featured ?? false,
        published: body.published ?? true,
        categoryId: body.categoryId
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        category: true
      }
    });

    return Response.json(
      {
        ok: true,
        message: "Product created successfully",
        product
      },
      { headers: { "Cache-Control": "no-cache, no-store" } }
    );
  } catch (error: any) {
    console.error("Failed to create product:", error);
    
    if (error.code === "P2002") {
      return Response.json(
        { ok: false, message: "Product slug already exists" },
        { status: 400 }
      );
    }

    return Response.json(
      { ok: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
