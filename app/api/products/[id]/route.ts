import { db } from "@/lib/db";

export async function GET(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop() ?? "";
  
  try {
    const product = await db.product.findFirst({
      where: {
        OR: [
          { id: productId },
          { slug: productId }
        ]
      }
    });

    if (!product) {
      return Response.json({ ok: false, message: "Product not found." }, { status: 404 });
    }

    return Response.json({ ok: true, product });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return Response.json({ ok: false, message: "Failed to fetch product" }, { status: 500 });
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
        console.error(`Category not found with slug: ${body.category}`);
        return Response.json({ ok: false, message: `Invalid category: ${body.category}` }, { status: 400 });
      }
    }

    // Verify categoryId is set (required field)
    if (!categoryId) {
      return Response.json({ ok: false, message: "Category is required" }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      unit: body.unit,
      inventory: body.inventory ? parseInt(body.inventory) : undefined,
      featured: body.featured ?? false,
      published: body.published ?? true,
      image: body.image,
      categoryId: categoryId
    };

    // Update product in database
    const updated = await db.product.update({
      where: { id: productId },
      data: updateData
    });

    return Response.json({
      ok: true,
      message: "Product updated successfully",
      product: updated
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    
    if (error.code === "P2025") {
      return Response.json({ ok: false, message: "Product not found" }, { status: 404 });
    }
    
    if (error.code === "P2002") {
      return Response.json({ ok: false, message: "Product slug must be unique" }, { status: 400 });
    }
    
    return Response.json({ ok: false, message: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();

  try {
    await db.product.delete({
      where: { id: productId }
    });

    return Response.json({
      ok: true,
      message: "Product deleted successfully"
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    
    if (error.code === "P2025") {
      return Response.json({ ok: false, message: "Product not found" }, { status: 404 });
    }
    
    return Response.json({ ok: false, message: "Failed to delete product" }, { status: 500 });
  }
}
