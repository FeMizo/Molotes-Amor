import { ok, fail } from "@/lib/api";
import { listCatalogProducts } from "@/services/catalog/catalog-read.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await listCatalogProducts();
    return ok(products);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo cargar catalogo.", 500);
  }
}
