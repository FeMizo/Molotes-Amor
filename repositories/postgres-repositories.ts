import type { PoolClient } from "pg";

import { dbQuery, withDbClient } from "@/lib/db";
import { normalizeSiteContent } from "@/data/site-content";
import type { Inventory } from "@/types/inventory";
import type { Order, OrderItem, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { SiteContent } from "@/types/site-content";
import type { InventoryRepository, OrderRepository, ProductRepository, SiteContentRepository } from "@/types/storage";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  previous_price: number | null;
  category: string;
  image: string;
  featured: boolean;
  available: boolean;
  tags: string[] | string;
  badge: Product["badge"] | null;
}

interface InventoryRow {
  product_id: string;
  stock: number;
  min_stock: number | null;
  allow_backorder: boolean;
}

interface OrderRow {
  id: string;
  payment_ref: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  created_at: Date | string;
  user_id: string | null;
  user_username: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  payment_method: Order["payment"] extends { method: infer T } ? T : string;
  payment_transfer_reference: string | null;
  payment_bank: string | null;
  payment_account_holder: string | null;
  payment_account_number: string | null;
  payment_clabe: string | null;
  notes: string | null;
}

interface OrderItemRow {
  order_id: string;
  position: number;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface SiteContentRow {
  id: string;
  payload: SiteContent | string;
}

const mapProductRow = (row: ProductRow): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  longDescription: row.long_description,
  price: Number(row.price),
  previousPrice: row.previous_price ?? undefined,
  category: row.category,
  image: row.image,
  featured: row.featured,
  available: row.available,
  tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags),
  badge: row.badge ?? undefined,
});

const mapInventoryRow = (row: InventoryRow): Inventory => ({
  productId: row.product_id,
  stock: Number(row.stock),
  minStock: row.min_stock ?? undefined,
  allowBackorder: row.allow_backorder,
});

const mapOrderItemRow = (row: OrderItemRow): OrderItem => ({
  productId: row.product_id,
  productName: row.product_name,
  unitPrice: Number(row.unit_price),
  quantity: Number(row.quantity),
  lineTotal: Number(row.line_total),
});

const mapOrderRow = (row: OrderRow, items: OrderItem[]): Order => ({
  id: row.id,
  paymentRef: row.payment_ref,
  items,
  subtotal: Number(row.subtotal),
  total: Number(row.total),
  status: row.status,
  createdAt: new Date(row.created_at).toISOString(),
  userId: row.user_id ?? undefined,
  userUsername: row.user_username ?? undefined,
  customer: {
    name: row.customer_name,
    phone: row.customer_phone,
    email: row.customer_email ?? undefined,
    address: row.customer_address ?? undefined,
  },
  payment: {
    method: row.payment_method === "transferencia" ? "transferencia" : "efectivo",
    transferReference: row.payment_transfer_reference ?? undefined,
    bank: row.payment_bank ?? undefined,
    accountHolder: row.payment_account_holder ?? undefined,
    accountNumber: row.payment_account_number ?? undefined,
    clabe: row.payment_clabe ?? undefined,
  },
  notes: row.notes ?? undefined,
});

const loadOrderItems = async (client: PoolClient, orderIds: string[]): Promise<Map<string, OrderItem[]>> => {
  const itemsByOrder = new Map<string, OrderItem[]>();
  if (orderIds.length === 0) {
    return itemsByOrder;
  }

  const { rows } = await client.query<OrderItemRow>(
    `
      SELECT order_id, position, product_id, product_name, unit_price, quantity, line_total
      FROM order_items
      WHERE order_id = ANY($1::text[])
      ORDER BY order_id ASC, position ASC
    `,
    [orderIds],
  );

  for (const row of rows) {
    const current = itemsByOrder.get(row.order_id) ?? [];
    current.push(mapOrderItemRow(row));
    itemsByOrder.set(row.order_id, current);
  }

  return itemsByOrder;
};

const productFieldSetters = (patch: Partial<Product>) => {
  const fields: Array<{ column: string; value: unknown }> = [];

  if ("slug" in patch && patch.slug !== undefined) fields.push({ column: "slug", value: patch.slug });
  if ("name" in patch && patch.name !== undefined) fields.push({ column: "name", value: patch.name });
  if ("description" in patch && patch.description !== undefined) {
    fields.push({ column: "description", value: patch.description });
  }
  if ("longDescription" in patch && patch.longDescription !== undefined) {
    fields.push({ column: "long_description", value: patch.longDescription });
  }
  if ("price" in patch && patch.price !== undefined) fields.push({ column: "price", value: patch.price });
  if ("previousPrice" in patch) fields.push({ column: "previous_price", value: patch.previousPrice ?? null });
  if ("category" in patch && patch.category !== undefined) fields.push({ column: "category", value: patch.category });
  if ("image" in patch && patch.image !== undefined) fields.push({ column: "image", value: patch.image });
  if ("featured" in patch && patch.featured !== undefined) fields.push({ column: "featured", value: patch.featured });
  if ("available" in patch && patch.available !== undefined) {
    fields.push({ column: "available", value: patch.available });
  }
  if ("tags" in patch && patch.tags !== undefined) fields.push({ column: "tags", value: JSON.stringify(patch.tags) });
  if ("badge" in patch) fields.push({ column: "badge", value: patch.badge ?? null });

  return fields;
};

export const postgresProductRepository: ProductRepository = {
  async list() {
    const { rows } = await dbQuery<ProductRow>(
      `
        SELECT id, slug, name, description, long_description, price, previous_price, category, image, featured, available, tags, badge
        FROM products
        ORDER BY name ASC
      `,
    );
    return rows.map(mapProductRow);
  },
  async findById(id) {
    const { rows } = await dbQuery<ProductRow>(
      `
        SELECT id, slug, name, description, long_description, price, previous_price, category, image, featured, available, tags, badge
        FROM products
        WHERE id = $1
      `,
      [id],
    );

    return rows[0] ? mapProductRow(rows[0]) : undefined;
  },
  async create(input) {
    const { rows } = await dbQuery<ProductRow>(
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
        RETURNING id, slug, name, description, long_description, price, previous_price, category, image, featured, available, tags, badge
      `,
      [
        input.id,
        input.slug,
        input.name,
        input.description,
        input.longDescription,
        input.price,
        input.previousPrice ?? null,
        input.category,
        input.image,
        input.featured,
        input.available,
        JSON.stringify(input.tags),
        input.badge ?? null,
      ],
    );

    return mapProductRow(rows[0]);
  },
  async update(id, patch) {
    const fields = productFieldSetters(patch);
    if (fields.length === 0) {
      const current = await this.findById(id);
      if (!current) {
        throw new Error("Producto no encontrado");
      }
      return current;
    }

    const setClause = fields.map((field, index) => `${field.column} = $${index + 2}`).join(", ");
    const params = [id, ...fields.map((field) => field.value)];

    const { rows } = await dbQuery<ProductRow>(
      `
        UPDATE products
        SET ${setClause}
        WHERE id = $1
        RETURNING id, slug, name, description, long_description, price, previous_price, category, image, featured, available, tags, badge
      `,
      params,
    );

    if (!rows[0]) {
      throw new Error("Producto no encontrado");
    }

    return mapProductRow(rows[0]);
  },
  async remove(id) {
    await dbQuery("DELETE FROM products WHERE id = $1", [id]);
  },
};

export const postgresInventoryRepository: InventoryRepository = {
  async list() {
    const { rows } = await dbQuery<InventoryRow>(
      `
        SELECT product_id, stock, min_stock, allow_backorder
        FROM inventory
        ORDER BY product_id ASC
      `,
    );
    return rows.map(mapInventoryRow);
  },
  async findByProductId(productId) {
    const { rows } = await dbQuery<InventoryRow>(
      `
        SELECT product_id, stock, min_stock, allow_backorder
        FROM inventory
        WHERE product_id = $1
      `,
      [productId],
    );
    return rows[0] ? mapInventoryRow(rows[0]) : undefined;
  },
  async upsert(record) {
    const { rows } = await dbQuery<InventoryRow>(
      `
        INSERT INTO inventory (product_id, stock, min_stock, allow_backorder)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (product_id)
        DO UPDATE SET
          stock = EXCLUDED.stock,
          min_stock = EXCLUDED.min_stock,
          allow_backorder = EXCLUDED.allow_backorder
        RETURNING product_id, stock, min_stock, allow_backorder
      `,
      [record.productId, record.stock, record.minStock ?? null, record.allowBackorder],
    );

    return mapInventoryRow(rows[0]);
  },
  async adjustStock(productId, delta) {
    return withDbClient(async (client) => {
      await client.query("BEGIN");

      try {
        const current = await client.query<InventoryRow>(
          `
            SELECT product_id, stock, min_stock, allow_backorder
            FROM inventory
            WHERE product_id = $1
            FOR UPDATE
          `,
          [productId],
        );

        if (!current.rows[0]) {
          throw new Error("Inventario no encontrado");
        }

        const nextStock = Math.max(0, Number(current.rows[0].stock) + delta);
        const updated = await client.query<InventoryRow>(
          `
            UPDATE inventory
            SET stock = $2
            WHERE product_id = $1
            RETURNING product_id, stock, min_stock, allow_backorder
          `,
          [productId, nextStock],
        );

        await client.query("COMMIT");
        return mapInventoryRow(updated.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    });
  },
};

export const postgresOrderRepository: OrderRepository = {
  async list() {
    return withDbClient(async (client) => {
      const ordersResult = await client.query<OrderRow>(
        `
          SELECT id, payment_ref, subtotal, total, status, created_at, user_id, user_username, customer_name, customer_phone, customer_email, customer_address, payment_method, payment_transfer_reference, payment_bank, payment_account_holder, payment_account_number, payment_clabe, notes
          FROM orders
          ORDER BY created_at DESC
        `,
      );

      const orderIds = ordersResult.rows.map((row) => row.id);
      const itemsByOrder = await loadOrderItems(client, orderIds);

      return ordersResult.rows.map((row) => mapOrderRow(row, itemsByOrder.get(row.id) ?? []));
    });
  },
  async findById(id) {
    return withDbClient(async (client) => {
      const orderResult = await client.query<OrderRow>(
        `
          SELECT id, payment_ref, subtotal, total, status, created_at, user_id, user_username, customer_name, customer_phone, customer_email, customer_address, payment_method, payment_transfer_reference, payment_bank, payment_account_holder, payment_account_number, payment_clabe, notes
          FROM orders
          WHERE id = $1
        `,
        [id],
      );

      const row = orderResult.rows[0];
      if (!row) {
        return undefined;
      }

      const itemsByOrder = await loadOrderItems(client, [id]);
      return mapOrderRow(row, itemsByOrder.get(id) ?? []);
    });
  },
  async create(order) {
    return withDbClient(async (client) => {
      await client.query("BEGIN");

      try {
        await client.query(
          `
            INSERT INTO orders (
              id,
              payment_ref,
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
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            )
          `,
          [
            order.id,
            order.paymentRef,
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
            `,
            [order.id, index, item.productId, item.productName, item.unitPrice, item.quantity, item.lineTotal],
          );
        }

        await client.query("COMMIT");
        return order;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    });
  },
  async updateStatus(id, status) {
    const { rows } = await dbQuery<OrderRow>(
      `
        UPDATE orders
        SET status = $2
        WHERE id = $1
        RETURNING id, payment_ref, subtotal, total, status, created_at, user_id, user_username, customer_name, customer_phone, customer_email, customer_address, payment_method, payment_transfer_reference, payment_bank, payment_account_holder, payment_account_number, payment_clabe, notes
      `,
      [id, status],
    );

    if (!rows[0]) {
      throw new Error("Pedido no encontrado");
    }

    const items = await this.findById(id);
    return mapOrderRow(rows[0], items?.items ?? []);
  },
};

export const postgresSiteContentRepository: SiteContentRepository = {
  async get() {
    const { rows } = await dbQuery<SiteContentRow>(
      `
        SELECT id, payload
        FROM site_content
        WHERE id = 'main'
      `,
    );

    const row = rows[0];
    if (!row) {
      return normalizeSiteContent();
    }

    const payload = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    return normalizeSiteContent(payload);
  },
  async update(content) {
    const nextContent = normalizeSiteContent(content);
    const { rows } = await dbQuery<SiteContentRow>(
      `
        INSERT INTO site_content (id, payload)
        VALUES ('main', $1::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET payload = EXCLUDED.payload
        RETURNING id, payload
      `,
      [JSON.stringify(nextContent)],
    );

    const payload = rows[0] ? rows[0].payload : nextContent;
    return normalizeSiteContent(typeof payload === "string" ? JSON.parse(payload) : payload);
  },
};

export const postgresRepositories = {
  products: postgresProductRepository,
  inventory: postgresInventoryRepository,
  orders: postgresOrderRepository,
  siteContent: postgresSiteContentRepository,
};
