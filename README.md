# Molotes El Tradicional

Base tecnica profesional con Next.js + TypeScript, respetando la UI existente.

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run start`
- `npm run db:up`
- `npm run db:down`
- `npm run db:logs`

## Desarrollo local con Postgres
1. Crea `.env.local` a partir de `.env.example`.
2. Levanta la base con `npm run db:up`.
3. Arranca la app con `npm run dev`.

Si `DATA_ADAPTER_MODE=database`, la app crea el schema automaticamente y carga el seed inicial la primera vez que encuentra una base vacia.

## Modulos implementados
- Admin funcional:
  - `/admin/products` alta, edicion, activacion/desactivacion, destacado y eliminacion.
  - `/admin/inventory` stock, stock minimo, backorder y estados de inventario.
  - `/admin/orders` listado, detalle, filtro basico y cambio de estado.
- Pedidos:
  - Checkout en `/checkout` desde carrito.
  - Validacion de stock antes de confirmar.
  - Descuento de inventario al crear pedido.
- Catalogo:
  - `ProductCard` muestra estado de inventario y bloquea compra sin stock (si no hay backorder).

## Persistencia local vs Vercel
- Modo recomendado:
  - `DATA_ADAPTER_MODE=database`
  - Usa Postgres via `molotes_DATABASE_URL`.
  - Funciona en local con Docker y en Vercel con una DB administrada.
- Modo fallback:
  - `DATA_ADAPTER_MODE=local-file`
  - Se usa `storage/db.json` via repositorio local en servidor (`repositories/file-store.ts`).
  - Util para pruebas sin DB, pero no para Vercel.
- Modo externo:
  - `DATA_ADAPTER_MODE=remote-api`
  - Sigue disponible como stub si luego separas frontend y backend.

## Deploy en Vercel
- Conecta el repo como proyecto Next.js normal.
- Configura `DATA_ADAPTER_MODE=database`.
- Configura `molotes_DATABASE_URL` con tu Postgres administrado.
- Si tu proveedor requiere SSL y la URL no lo forza, deja `POSTGRES_SSL` sin definir.
- No uses `output: "export"`: este proyecto depende de `app/api` y persistencia en servidor.

## Estructura principal
```text
app/
  api/
    catalog/products
    admin/products
    admin/inventory
    admin/orders
  admin/
    page.tsx
    products/page.tsx
    inventory/page.tsx
    orders/page.tsx
  checkout/page.tsx
components/
  admin/
  cart/
  layout/
  home/
  products/
  pages/
hooks/
repositories/
services/
store/
types/
storage/
```
