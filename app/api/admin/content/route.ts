import { fail, ok } from "@/lib/api";
import { getSiteContent, updateSiteContent } from "@/services/content/site-content.service";
import type { DeepPartial, SiteContent } from "@/types/site-content";

export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await getSiteContent();
    return ok(content);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo cargar el contenido.", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as DeepPartial<SiteContent>;
    const updated = await updateSiteContent(body);
    return ok(updated);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo guardar el contenido.", 500);
  }
}
