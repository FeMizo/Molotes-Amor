import { fail, ok } from "@/lib/api";
import { createOrder, listOrders } from "@/services/orders/order.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    return ok(await listOrders());
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo listar pedidos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      account?: { userId: string; username: string };
      customer: { name: string; phone: string; address?: string };
      notes?: string;
      items: { productId: string; quantity: number }[];
    };

    if (
      !body.account?.userId ||
      !body.account?.username ||
      !body.customer?.name ||
      !body.customer?.phone ||
      !Array.isArray(body.items)
    ) {
      return fail("Datos invalidos para crear pedido.");
    }

    const order = await createOrder({
      account: body.account,
      customer: body.customer,
      notes: body.notes,
      items: body.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      })),
    });

    return ok(order, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo crear pedido.", 400);
  }
}
