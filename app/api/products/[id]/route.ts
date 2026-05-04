import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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
    // Check authentication
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update product in database
    const updated = await db.product.update({
      where: { id: productId },
      data: {
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
        categoryId: body.categoryId
      }
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
    
    return Response.json({ ok: false, message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();

  try {
    // Check authentication
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

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
