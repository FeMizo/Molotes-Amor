# Molotes El Tradicional

Base tecnica profesional con Next.js + TypeScript, respetando la UI existente.

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run start`

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

## Persistencia local vs produccion
- Modo local real:
  - `DATA_ADAPTER_MODE=local-file`
  - Se usa `storage/db.json` via repositorio local en servidor (`repositories/file-store.ts`).
  - Permite cambios reales en local para productos, inventario y pedidos.
- Modo preparado para no local:
  - `DATA_ADAPTER_MODE=remote-api`
  - La arquitectura ya separa repositorios y servicios (`types/storage.ts`, `repositories/local-repositories.ts`).
  - Debes implementar adapter remoto real (API/DB) sin rehacer UI ni logica de negocio.
  - Cliente ya soporta base URL externa con `NEXT_PUBLIC_ADMIN_API_BASE_URL`.

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
