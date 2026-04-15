# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on port 4200
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit

npm run db:up        # Start PostgreSQL via Docker Compose
npm run db:down      # Stop DB
npm run db:logs      # Tail DB logs
```

No test suite exists in this project.

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Zustand, PostgreSQL (`pg`), Vercel Blob, Framer Motion.

### Database

`lib/db.ts` manages a singleton `pg.Pool`. On first query call, `ensureDatabaseReady()` runs: creates all tables and runs `ALTER TABLE ADD COLUMN IF NOT EXISTS` migrations inline (no migration framework). Seeds initial data from `data/` if tables are empty.

Local dev DB: `docker compose up -d db` → `molotes_DATABASE_URL=postgresql://molotes:molotes@localhost:5432/molotes`

SSL is auto-disabled for localhost connections. Set `POSTGRES_SSL=false` to force-disable.

### Auth & State

Authentication is **client-side only** — no server sessions or cookies. `store/auth-store.ts` (Zustand + localStorage key `molotes-auth`) holds all users and the active session. `store/cart-store.ts` persists the cart under `molotes-cart`.

Roles: `"admin"` | `"user"`. Admin user is identified by `username === "adminmolotes"` as a fallback normalizer. Admin UI lives at `/admin`, user account at `/mi-cuenta`.

### Service Layer

```
services/
  auth/          # Pure functions for login, register, session creation
  catalog/       # Product catalog reads (server-side DB queries)
  admin/         # Admin CRUD: products, combos, inventory
  orders/        # Order creation and retrieval
  account/       # User account updates
  content/       # Site content (CMS-like, stored in site_content table)
  client/        # HTTP utilities for client-side API calls
```

Services under `catalog/`, `admin/`, `orders/`, `content/` run server-side and call `dbQuery` directly. Services under `client/` are browser-side fetch wrappers hitting `/api/` routes.

### Data Model

- **Prices** are stored as integers (whole pesos, not cents).
- **Payment refs** are zero-padded 3-digit strings unique per calendar day (e.g. `"042"`).
- **Payment methods**: `"efectivo"` | `"transferencia"`. Transfer config (bank, CLABE, account) is stored in `site_content`.
- **Combos**: bundles of products with `regular_price` and `final_price`.
- **Inventory**: separate table keyed by `product_id`; `allow_backorder` controls whether out-of-stock items can be ordered.

### Notifications

WhatsApp notifications via Twilio (`lib/whatsapp.ts`). Requires env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `TWILIO_ADMIN_PHONE`. All are optional — silently skipped if absent.

### Image Storage

Product and combo images are uploaded to Vercel Blob via `/api/admin/upload`. Requires `BLOB_READ_WRITE_TOKEN`.

### Site Content (CMS)

A single JSON blob stored in `site_content` table under id `"main"`. Managed via the admin `/admin/content` page. Contains brand info, hero copy, operations config (delivery days, transfer enabled, etc.).
