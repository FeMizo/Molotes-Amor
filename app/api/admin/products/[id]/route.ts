import { fail, ok } from "@/lib/api";
import { deleteProductWithInventory, updateProductWithInventory } from "@/services/admin/product-admin.service";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    const updated = await updateProductWithInventory(id, {
      ...(body as object),
      price: body.price !== undefined ? Number(body.price) : undefined,
      previousPrice: body.previousPrice !== undefined ? Number(body.previousPrice) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      minStock: body.minStock !== undefined ? Number(body.minStock) : undefined,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : undefined,
    });

    return ok(updated);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo actualizar producto.", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteProductWithInventory(id);
    return ok({ ok: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo eliminar producto.", 500);
  }
}
