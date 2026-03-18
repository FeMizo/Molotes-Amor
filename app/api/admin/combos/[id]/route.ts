import { fail, ok } from "@/lib/api";
import { deleteCombo, updateCombo } from "@/services/admin/combo-admin.service";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      image?: string;
      items?: Array<{ productId: string; quantity: number }>;
      finalPrice?: number;
      active?: boolean;
      featured?: boolean;
      order?: number;
      category?: string;
    };

    return ok(
      await updateCombo(id, {
        ...body,
        finalPrice: body.finalPrice !== undefined ? Number(body.finalPrice) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Combo no encontrado") {
      return fail(error.message, 404);
    }

    return fail(error instanceof Error ? error.message : "No se pudo actualizar el combo.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteCombo(id);
    return ok({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Combo no encontrado") {
      return fail(error.message, 404);
    }

    return fail(error instanceof Error ? error.message : "No se pudo eliminar el combo.", 500);
  }
}
