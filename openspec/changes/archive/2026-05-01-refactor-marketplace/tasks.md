# Tasks: Refactorización Estética y Modular del Marketplace

## Phase 1: Foundation (Types & Hooks)

- [x] 1.1 Crear `types/market.ts` con interfaces `Product`, `CartItem` y `MarketState`.
- [x] 1.2 Crear `hooks/useMarket.ts` con lógica de fetch asíncrono (800ms delay) y filtrado reactivo.
- [x] 1.3 Crear `hooks/useCart.ts` para gestionar el estado local del carrito y persistencia en localStorage.

## Phase 2: UI Foundation (Skeletons & Atomic Cards)

- [x] 2.1 Crear `components/features/market/ProductCardSkeleton.tsx` usando el keyframe `shimmer`.
- [x] 2.2 Crear `components/features/market/ProductCard.tsx` con diseño glass-surface y accent `lime-400`.
- [x] 2.3 Crear `components/features/market/MarketGrid.tsx` para orquestar la visualización (Loading -> Grid -> EmptyState).

## Phase 3: Integration & Wiring

- [x] 3.1 Crear `components/features/market/MarketHeader.tsx` integrando búsqueda y botones de acción.
- [x] 3.2 Refactorizar `app/(app)/market/page.tsx` eliminando lógica monolítica e integrando los nuevos componentes.
- [x] 3.3 Conectar `MarketHeader` con el estado de búsqueda del hook `useMarket`.

## Phase 4: Verification & Testing

- [x] 4.1 Verificar escenario: Carga exitosa con delay (Skeletons visibles).
- [x] 4.2 Verificar escenario: Búsqueda sin resultados (Empty State glass-surface).
- [x] 4.3 Verificar escenario: Agregar producto al carrito (Toast + Counter update).

## Phase 5: Polish & Aesthetics

- [x] 5.1 Agregar background glows (`bg-primary/10` con blur) en `MarketPage`.
- [x] 5.2 Implementar animaciones de entrada GSAP para las cards al terminar el loading.
