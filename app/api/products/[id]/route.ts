import { shopProducts } from "@/data/shop-catalog";

export async function GET(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop() ?? "";
  const product = shopProducts.find((entry) => entry.id === productId || entry.slug === productId);

  if (!product) {
    return Response.json({ ok: false, message: "Product not found." }, { status: 404 });
  }

  return Response.json({ ok: true, product });
}

export async function PATCH(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();
  const body = await request.json();

  return Response.json({
    ok: true,
    productId,
    message: "Demo product update accepted. Persist with Prisma for production.",
    updates: body
  });
}

export async function DELETE(request: Request) {
  const productId = new URL(request.url).pathname.split("/").pop();

  return Response.json({
    ok: true,
    productId,
    message: "Demo product delete accepted. Persist with Prisma for production."
  });
}
