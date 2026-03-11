import { fail, ok } from "@/lib/api";
import { createProductWithInventory, listProductsWithInventory } from "@/services/admin/product-admin.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await listProductsWithInventory();
    return ok(products);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudieron listar productos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name: string;
      description: string;
      longDescription: string;
      price: number;
      previousPrice?: number;
      category: string;
      image: string;
      featured: boolean;
      available: boolean;
      tags: string[];
      badge?: "Popular" | "Nuevo" | "Mas pedido";
      stock: number;
      minStock?: number;
      allowBackorder: boolean;
    };

    if (!body.name || Number.isNaN(Number(body.price))) {
      return fail("Datos invalidos para crear producto.");
    }

    const created = await createProductWithInventory({
      ...body,
      price: Number(body.price),
      stock: Number(body.stock ?? 0),
      minStock: body.minStock !== undefined ? Number(body.minStock) : undefined,
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    return ok(created, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo crear producto.", 500);
  }
}
