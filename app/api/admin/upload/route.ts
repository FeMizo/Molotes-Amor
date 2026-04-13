import { fail } from "@/lib/api";

const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "avif"] as const;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return fail("No se recibio ningun archivo.", 400);
    }

    const originalName = file instanceof File ? file.name : "upload";
    const ext = originalName.split(".").pop()?.toLowerCase() ?? "";

    if (!ALLOWED_EXTS.includes(ext as (typeof ALLOWED_EXTS)[number])) {
      return fail(`Formato no permitido. Usa: ${ALLOWED_EXTS.join(", ")}.`, 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return fail("La imagen no puede superar 5 MB.", 400);
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, file, { access: "public" });
      return Response.json({ url: blob.url }, { status: 201 });
    }

    const { mkdir, writeFile } = await import("fs/promises");
    const { join } = await import("path");
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));

    return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo subir la imagen.", 500);
  }
}
