# Molotes El Tradicional

Base técnica profesional con **Next.js + TypeScript**, manteniendo el diseño retro cálido original.

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run start`

## Arquitectura
```text
app/
  page.tsx
  menu/page.tsx
  nosotros/page.tsx
  contacto/page.tsx
  admin/page.tsx
components/
  layout/
  home/
  products/
  cart/
  search/
  pages/
  admin/
data/
features/
store/
types/
```

## Incluye
- Header, Hero, ProductCard, CartDrawer y Footer preservados visualmente.
- Buscador funcional por texto + categorías.
- Carrito lateral con lógica real, animación y persistencia local.
- Rutas: Inicio, Menú, Nosotros, Contacto y Admin.
- Base de administrador lista para ampliar módulos futuros.
