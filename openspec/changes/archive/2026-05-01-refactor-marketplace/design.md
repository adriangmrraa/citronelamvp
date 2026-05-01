# Design: Refactorización Estética y Modular del Marketplace

## Technical Approach
Reemplazar la arquitectura monolítica por una **arquitectura orientada a dominio** dentro de `components/features/market/`. Utilizaremos hooks personalizados para encapsular la lógica de estado y efectos GSAP para las entradas visuales.

## Architecture Decisions

### Decision: Custom Hooks vs. Context
**Choice**: Custom Hooks (`useMarket`, `useCart`).
**Alternatives considered**: React Context.
**Rationale**: El estado del mercado es local a la ruta `/market`. Un hook es más liviano y fácil de testear con Vitest.

### Decision: Skeleton Pattern
**Choice**: Reutilizar el keyframe `shimmer` de `globals.css` en un nuevo `ProductCardSkeleton`.
**Rationale**: Consistencia visual absoluta con el módulo de Eventos.

## Data Flow
`Page` (Orquestador) -> `useMarket` (Data) -> `MarketGrid` -> `ProductCard`.
El carrito se maneja vía `useCart` que expone métodos de mutación y estado.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `hooks/useMarket.ts` | Create | Hook para productos y filtros. |
| `hooks/useCart.ts` | Create | Hook para lógica de carrito. |
| `components/features/market/MarketGrid.tsx` | Create | Grid que maneja estados de loading/error. |
| `components/features/market/ProductCard.tsx` | Create | Componente visual del producto. |
| `components/features/market/ProductCardSkeleton.tsx` | Create | Versión shimmer de la card. |
| `app/(app)/market/page.tsx` | Modify | Reducción a < 80 lines, delegando lógica. |

## Testing Strategy
- **Unit**: Testear `useMarket` con diferentes términos de búsqueda y categorías.
- **Visual**: Verificar que los Skeletons se alineen con el grid de productos reales.
