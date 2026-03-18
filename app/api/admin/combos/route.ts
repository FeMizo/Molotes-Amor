import { fail, ok } from "@/lib/api";
import { createCombo, listCombos } from "@/services/admin/combo-admin.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    return ok(await listCombos());
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudieron listar combos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name: string;
      description?: string;
      image?: string;
      items: Array<{ productId: string; quantity: number }>;
      finalPrice: number;
      active: boolean;
      featured: boolean;
      order?: number;
      category?: string;
    };

    return ok(
      await createCombo({
        ...body,
        items: Array.isArray(body.items) ? body.items : [],
        finalPrice: Number(body.finalPrice),
        order: body.order !== undefined ? Number(body.order) : undefined,
      }),
      { status: 201 },
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo crear el combo.", 500);
  }
}
