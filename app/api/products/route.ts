import { shopProducts } from "@/data/shop-catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const sort = searchParams.get("sort") ?? "popularity";

  const products = shopProducts
    .filter((product) => (category ? product.category === category : true))
    .filter((product) =>
      search
        ? [product.name, product.shortDescription, product.origin, product.unit]
            .join(" ")
            .toLowerCase()
            .includes(search)
        : true
    )
    .sort((left, right) => {
      switch (sort) {
        case "price-low":
          return left.price - right.price;
        case "price-high":
          return right.price - left.price;
        case "newest":
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        case "best-selling":
          return right.bestSellerScore - left.bestSellerScore;
        case "popularity":
        default:
          return right.popularity - left.popularity;
      }
    });

  return Response.json({
    ok: true,
    total: products.length,
    products
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(
    {
      ok: true,
      message: "Demo product accepted. Persist this with Prisma in production mode.",
      product: {
        id: `demo-${Date.now()}`,
        ...body
      }
    },
    { status: 201 }
  );
}
