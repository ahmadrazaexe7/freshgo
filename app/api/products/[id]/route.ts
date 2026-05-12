import { db } from "@/lib/db";

export const revalidate = 60; // ISR

export async function GET(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop() ?? "";
  
  try {
    const product = await db.product.findFirst({
      where: {
        OR: [
          { id: productId },
          { slug: productId }
        ],
        published: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        gallery: true,
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
    });

    if (!product) {
      return Response.json(
        { ok: false, message: "Product not found." },
        { status: 404, headers: { "Cache-Control": "no-cache" } }
      );
    }

    return Response.json(
      { ok: true, product },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return Response.json(
      { ok: false, message: "Failed to fetch product" },
      { status: 500, headers: { "Cache-Control": "no-cache" } }
    );
  }
}

export async function PATCH(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();
  
  try {
    const body = await request.json();

    // Find category by slug if category is provided instead of categoryId
    let categoryId = body.categoryId;
    if (!categoryId && body.category) {
      const category = await db.category.findUnique({
        where: { slug: body.category }
      });
      if (category) {
        categoryId = category.id;
      } else {
        return Response.json(
          { ok: false, message: `Invalid category: ${body.category}` },
          { status: 400 }
        );
      }
    }

    if (!categoryId) {
      return Response.json(
        { ok: false, message: "Category is required" },
        { status: 400 }
      );
    }

    // Prepare update data - only include provided fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? parseFloat(body.salePrice) : null;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.inventory !== undefined) updateData.inventory = parseInt(body.inventory);
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.gallery !== undefined) updateData.gallery = body.gallery;
    updateData.categoryId = categoryId;

    // Update product in database
    const updated = await db.product.update({
      where: { id: productId },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        published: true
      }
    });

    return Response.json(
      {
        ok: true,
        message: "Product updated successfully",
        product: updated
      },
      { headers: { "Cache-Control": "no-cache, no-store" } }
    );
  } catch (error: any) {
    console.error("Failed to update product:", error);
    
    if (error.code === "P2025") {
      return Response.json(
        { ok: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    if (error.code === "P2002") {
      return Response.json(
        { ok: false, message: "Product slug must be unique" },
        { status: 400 }
      );
    }
    
    return Response.json(
      { ok: false, message: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();

  try {
    await db.product.delete({
      where: { id: productId }
    });

    return Response.json(
      { ok: true, message: "Product deleted successfully" },
      { headers: { "Cache-Control": "no-cache, no-store" } }
    );
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    
    if (error.code === "P2025") {
      return Response.json(
        { ok: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    return Response.json(
      { ok: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
