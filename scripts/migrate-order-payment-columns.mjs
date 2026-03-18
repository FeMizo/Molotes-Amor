import { Client } from "pg";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const loadEnvFile = (fileName) => {
  const filePath = path.join(projectRoot, fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env.development.local");
loadEnvFile(".env");

const connectionString = process.env.molotes_DATABASE_URL;

if (!connectionString) {
  console.error("Falta molotes_DATABASE_URL en el entorno.");
  process.exit(1);
}

const shouldUseSsl =
  process.env.POSTGRES_SSL !== "false" &&
  !/localhost|127\.0\.0\.1/.test(connectionString);

const client = new Client({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

try {
  await client.connect();
  await client.query("BEGIN");

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS customer_email TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_ref TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'efectivo';
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_transfer_reference TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_bank TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_account_holder TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_account_number TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_clabe TEXT;
  `);

  const result = await client.query(`
    UPDATE orders
    SET payment_method = 'efectivo'
    WHERE payment_method IS NULL OR BTRIM(payment_method) = '';
  `);

  const paymentRefResult = await client.query(`
    UPDATE orders
    SET payment_ref = LPAD(
      RIGHT(
        REGEXP_REPLACE(
          COALESCE(NULLIF(payment_transfer_reference, ''), id),
          '\\D',
          '',
          'g'
        ),
        3
      ),
      3,
      '0'
    )
    WHERE payment_ref IS NULL OR BTRIM(payment_ref) = '';
  `);

  await client.query("COMMIT");
  console.log(
    `Migracion aplicada: columnas de pago listas, ${result.rowCount ?? 0} pedidos rellenados con 'efectivo' y ${paymentRefResult.rowCount ?? 0} referencias cortas generadas.`,
  );
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  console.error("No se pudo aplicar la migracion de pago.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
