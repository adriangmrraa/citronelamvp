# Proposal: Refactorización Estética y Modular del Marketplace

## Intent

El estado actual del Marketplace es un monolito acoplado que no cumple con los estándares visuales ni arquitectónicos del proyecto. Necesitamos reconstruirlo desde cero siguiendo el patrón de **Eventos**: lógica asíncrona en hooks, componentes modulares y una interfaz de alta fidelidad con skeletons premium.

## Scope

### In Scope
- Creación de `hooks/useMarket.ts` (lógica asíncrona y mock data).
- Modularización de componentes en `components/features/market/`.
- Implementación de `ProductCardSkeleton` con efecto shimmer.
- Rediseño de la página principal del Marketplace con glows y glassmorphism.
- Sincronización estética con los módulos de "Eventos" y "Mi Cultivo".

### Out of Scope
- Persistencia real en base de datos (se mantiene mock con delay).
- Pasarela de pagos real.
- Panel de administración de productos (se mantiene el form básico modularizado).

## Approach

Reemplazar el archivo monolítico por una estructura de **Soberanía Tecnológica**:
1. Extraer lógica de datos a hooks reactivos con estados `isLoading` y `error`.
2. Crear componentes presentacionales puros para el Grid, el Header y las Cards.
3. Inyectar estilos globales (`glass-surface`, `glows`) para elevar la calidad visual.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/(app)/market/page.tsx` | Modified | Se convierte en un orquestador delgado. |
| `hooks/useMarket.ts` | New | Nueva lógica de negocio asíncrona. |
| `components/features/market/` | New | Directorio para componentes del dominio. |
| `types/market.ts` | New | Definiciones de tipos para productos y carrito. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Pérdida de funcionalidad del carrito | Low | Testear el hook `useCart` de forma aislada. |
| Desajuste visual con el layout global | Low | Usar tokens de `globals.css`. |

## Rollback Plan

El archivo original `app/(app)/market/page.tsx` será respaldado o versionado vía git antes de la refactorización profunda.

## Success Criteria

- [ ] El Marketplace carga con skeletons shimmer durante ~800ms.
- [ ] La página principal tiene menos de 100 líneas de código.
- [ ] La estética es indistinguible de la sección de Eventos (misma profundidad y glows).
- [ ] El filtrado y el carrito funcionan correctamente sin bugs.
