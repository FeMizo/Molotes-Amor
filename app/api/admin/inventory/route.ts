import { fail, ok } from "@/lib/api";
import { listInventoryRows, updateInventoryRow } from "@/services/admin/inventory-admin.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    return ok(await listInventoryRows());
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo listar inventario.", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      productId: string;
      stock: number;
      minStock?: number;
      allowBackorder: boolean;
      available?: boolean;
    };

    if (!body.productId) {
      return fail("productId es obligatorio");
    }

    const rows = await updateInventoryRow({
      productId: body.productId,
      stock: Number(body.stock),
      minStock: body.minStock !== undefined ? Number(body.minStock) : undefined,
      allowBackorder: Boolean(body.allowBackorder),
      available: body.available,
    });

    return ok(rows);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo actualizar inventario.", 500);
  }
}
