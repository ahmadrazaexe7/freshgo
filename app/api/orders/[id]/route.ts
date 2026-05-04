import { db } from "@/lib/db";

export async function GET(request: Request) {
  const orderId = new URL(request.url).pathname.split("/").pop() ?? "";

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return Response.json({ ok: false, message: "Order not found." }, { status: 404 });
    }

    return Response.json({ ok: true, order });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return Response.json({ ok: false, message: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const orderId = new URL(request.url).pathname.split("/").pop();
  const body = await request.json();

  try {
    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status: body.status,
        fullName: body.fullName,
        phone: body.phone,
        city: body.city,
        area: body.area,
        addressLine: body.addressLine,
        notes: body.notes
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return Response.json({ ok: true, order: updated });
  } catch (error: any) {
    console.error("Failed to update order:", error);

    if (error.code === "P2025") {
      return Response.json({ ok: false, message: "Order not found" }, { status: 404 });
    }

    return Response.json({ ok: false, message: "Failed to update order" }, { status: 500 });
  }
}
