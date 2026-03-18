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
      user_id TEXT,
      user_username TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_address TEXT,
      payment_method TEXT NOT NULL DEFAULT 'efectivo',
      payment_transfer_reference TEXT,
      payment_bank TEXT,
      payment_account_holder TEXT,
      payment_account_number TEXT,
      payment_clabe TEXT,
      notes TEXT
    );
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS user_id TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS user_username TEXT;
  `);

  await client.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS customer_email TEXT;
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

  await client.query(`
    UPDATE orders
    SET payment_method = 'efectivo'
    WHERE payment_method IS NULL OR BTRIM(payment_method) = '';
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

  const existingOrders = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM orders",
  );

  if (Number(existingOrders.rows[0]?.count ?? "0") === 0) {
    for (const order of seed.orders) {
      await client.query(
        `
          INSERT INTO orders (
            id,
            subtotal,
            total,
            status,
            created_at,
            user_id,
            user_username,
            customer_name,
            customer_phone,
            customer_email,
            customer_address,
            payment_method,
            payment_transfer_reference,
            payment_bank,
            payment_account_holder,
            payment_account_number,
            payment_clabe,
            notes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          order.id,
          order.subtotal,
          order.total,
          order.status,
          order.createdAt,
          order.userId ?? null,
          order.userUsername ?? null,
          order.customer.name,
          order.customer.phone,
          order.customer.email ?? null,
          order.customer.address ?? null,
          order.payment?.method ?? "efectivo",
          order.payment?.transferReference ?? null,
          order.payment?.bank ?? null,
          order.payment?.accountHolder ?? null,
          order.payment?.accountNumber ?? null,
          order.payment?.clabe ?? null,
          order.notes ?? null,
        ],
      );

      for (const [index, item] of order.items.entries()) {
        await client.query(
          `
            INSERT INTO order_items (
              order_id,
              position,
              product_id,
              product_name,
              unit_price,
              quantity,
              line_total
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7
            )
            ON CONFLICT (order_id, position) DO NOTHING
          `,
          [
            order.id,
            index,
            item.productId,
            item.productName,
            item.unitPrice,
            item.quantity,
            item.lineTotal,
          ],
        );
      }
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
