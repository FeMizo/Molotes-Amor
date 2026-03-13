import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";

import { seedStore } from "@/data/seed-store";

const globalForDb = globalThis as typeof globalThis & {
  __molotesPool?: Pool;
  __molotesDbReady?: Promise<void>;
};

const resolveConnectionString = (): string => {
  const connectionString = process.env.molotes_DATABASE_URL;
  if (!connectionString) {
    throw new Error("molotes_DATABASE_URL no esta configurada.");
  }
  return connectionString;
};

const shouldUseSsl = (connectionString: string): boolean => {
  if (process.env.POSTGRES_SSL === "false") {
    return false;
  }

  return !/localhost|127\.0\.0\.1/.test(connectionString);
};

const getPool = (): Pool => {
  if (globalForDb.__molotesPool) {
    return globalForDb.__molotesPool;
  }

  const connectionString = resolveConnectionString();
  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : false,
  });

  globalForDb.__molotesPool = pool;
  return pool;
};

const createSchema = async (client: PoolClient): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT NOT NULL,
      price INTEGER NOT NULL,
      previous_price INTEGER,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      available BOOLEAN NOT NULL DEFAULT TRUE,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      badge TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      product_id TEXT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
      stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER,
      allow_backorder BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT,
      notes TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      unit_price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      line_total INTEGER NOT NULL,
      PRIMARY KEY (order_id, position)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL
    );
  `);
};

const seedDatabase = async (client: PoolClient): Promise<void> => {
  const seed = seedStore();
  const existing = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM products",
  );

  if (Number(existing.rows[0]?.count ?? "0") === 0) {
    for (const product of seed.products) {
      await client.query(
        `
          INSERT INTO products (
            id,
            slug,
            name,
            description,
            long_description,
            price,
            previous_price,
            category,
            image,
            featured,
            available,
            tags,
            badge
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          product.id,
          product.slug,
          product.name,
          product.description,
          product.longDescription,
          product.price,
          product.previousPrice ?? null,
          product.category,
          product.image,
          product.featured,
          product.available,
          JSON.stringify(product.tags),
          product.badge ?? null,
        ],
      );
    }

    for (const record of seed.inventory) {
      await client.query(
        `
          INSERT INTO inventory (product_id, stock, min_stock, allow_backorder)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (product_id) DO NOTHING
        `,
        [
          record.productId,
          record.stock,
          record.minStock ?? null,
          record.allowBackorder,
        ],
      );
    }
  }

  await client.query(
    `
      INSERT INTO site_content (id, payload)
      VALUES ('main', $1::jsonb)
      ON CONFLICT (id) DO NOTHING
    `,
    [JSON.stringify(seed.siteContent)],
  );
};

export const ensureDatabaseReady = async (): Promise<void> => {
  if (!globalForDb.__molotesDbReady) {
    globalForDb.__molotesDbReady = (async () => {
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        await createSchema(client);
        await seedDatabase(client);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    })();
  }

  return globalForDb.__molotesDbReady;
};

export const dbQuery = async <TRow extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<TRow>> => {
  await ensureDatabaseReady();
  return getPool().query<TRow>(text, params);
};

export const withDbClient = async <T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  await ensureDatabaseReady();
  const client = await getPool().connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
};
