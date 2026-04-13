import { fail, ok } from "@/lib/api";
import { notifyOrderStatusChange } from "@/lib/whatsapp";
import { updateOrderStatus } from "@/services/orders/order.service";
import type { OrderStatus } from "@/types/order";

export const runtime = "nodejs";

const allowedStatuses: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "preparando",
  "en-camino",
  "entregado",
  "cancelado",
];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status: OrderStatus };

    if (!allowedStatuses.includes(body.status)) {
      return fail("Estado de pedido invalido.");
    }

    const order = await updateOrderStatus(id, body.status);

    notifyOrderStatusChange(order, body.status).catch((err: unknown) => {
      console.error("[whatsapp] Error enviando notificacion:", err instanceof Error ? err.message : err);
    });

    return ok(order);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo actualizar estado.", 500);
  }
}
