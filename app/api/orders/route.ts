import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return Response.json({
      ok: true,
      total: orders.length,
      orders
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return Response.json({ ok: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ ok: false, message: "Invalid order payload" }, { status: 400 });
    }

    const orderData: any = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      area: body.area,
      addressLine: body.addressLine,
      notes: body.notes ?? "",
      subtotal: parseFloat(String(body.subtotal)) ?? 0,
      deliveryFee: parseFloat(String(body.deliveryFee)) ?? 0,
      total: parseFloat(String(body.total)) ?? 0,
      paymentMethod: body.paymentMethod ?? "COD",
      whatsappOptIn: true,
      items: {
        create: body.items.map((item: any) => ({
          productId: item.productId,
          productName: item.name,
          quantity: parseInt(String(item.quantity), 10),
          unitPrice: parseFloat(String(item.price)),
          lineTotal: parseFloat(String(item.price * item.quantity))
        }))
      }
    };

    const order = await db.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return Response.json({ ok: true, message: "Order created successfully", order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return Response.json({ ok: false, message: "Failed to create order" }, { status: 500 });
  }
}
