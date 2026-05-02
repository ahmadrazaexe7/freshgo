import { shopProducts } from "@/data/shop-catalog";

const demoOrders = [
  {
    id: "FHM-24028",
    status: "Out for delivery",
    total: 1360,
    city: "Islamabad",
    area: "F-11",
    items: [
      { name: shopProducts[0].name, quantity: 2 },
      { name: shopProducts[8].name, quantity: 1 }
    ]
  },
  {
    id: "FHM-24019",
    status: "Delivered",
    total: 1810,
    city: "Rawalpindi",
    area: "Bahria Town Phase 7",
    items: [
      { name: shopProducts[4].name, quantity: 1 },
      { name: shopProducts[10].name, quantity: 1 }
    ]
  }
];

export async function GET() {
  return Response.json({
    ok: true,
    total: demoOrders.length,
    orders: demoOrders
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(
    {
      ok: true,
      message: "Demo order accepted. Persist this with Prisma and inventory logic in production.",
      order: {
        id: `FHM-${Math.floor(10000 + Math.random() * 89999)}`,
        status: "Confirmed",
        ...body
      }
    },
    { status: 201 }
  );
}
