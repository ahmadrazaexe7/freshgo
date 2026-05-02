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

export async function GET(request: Request) {
  const orderId = new URL(request.url).pathname.split("/").pop() ?? "";
  const order = demoOrders.find((entry) => entry.id === orderId);

  if (!order) {
    return Response.json({ ok: false, message: "Order not found." }, { status: 404 });
  }

  return Response.json({ ok: true, order });
}

export async function PATCH(request: Request) {
  const orderId = new URL(request.url).pathname.split("/").pop();
  const body = await request.json();

  return Response.json({
    ok: true,
    orderId,
    message: "Demo order update accepted. Persist with Prisma in production.",
    updates: body
  });
}
