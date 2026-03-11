import { fail, ok } from "@/lib/api";
import { getOrderById } from "@/services/orders/order.service";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return fail("Pedido no encontrado", 404);
    }
    return ok(order);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo obtener pedido.", 500);
  }
}
