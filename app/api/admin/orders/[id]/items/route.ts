import { fail, ok } from "@/lib/api";
import { updateOrderItems } from "@/services/orders/order.service";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      items: {
        productId: string;
        productName: string;
        unitPrice: number;
        quantity: number;
      }[];
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return fail("El pedido debe tener al menos un producto.");
    }

    const order = await updateOrderItems(id, body.items);
    return ok(order);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo actualizar el pedido.", 400);
  }
}
