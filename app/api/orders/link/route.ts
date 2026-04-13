import { fail, ok } from "@/lib/api";
import { dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId: string;
      username: string;
      email?: string;
      phone?: string;
    };

    if (!body.userId || !body.username || (!body.email && !body.phone)) {
      return fail("Datos insuficientes para vincular pedidos.");
    }

    const result = await dbQuery<{ id: string }>(
      `UPDATE orders
       SET user_id = $1, user_username = $2
       WHERE user_id IS NULL
         AND (
           ($3::text IS NOT NULL AND LOWER(customer_email) = LOWER($3))
           OR
           ($4::text IS NOT NULL AND customer_phone = $4)
         )
       RETURNING id`,
      [body.userId, body.username, body.email ?? null, body.phone ?? null],
    );

    return ok({ linked: result.rows.length });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudieron vincular pedidos.", 500);
  }
}
