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
    ADD COLUMN IF NOT EXISTS user_id TEXT;
  `);
  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS user_username TEXT;
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_orders_user_id
    ON orders (user_id);
  `);
  await client.query("COMMIT");
  console.log("Migracion aplicada: orders.user_id y orders.user_username listos.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  console.error("No se pudo aplicar la migracion.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
