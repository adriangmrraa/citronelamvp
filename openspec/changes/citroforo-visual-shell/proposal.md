# Proposal: Citroforo Visual Shell (Mockup)

## Intent
Crear una maqueta de alta fidelidad ("Visual Shell") para el Citroforo que permita al cliente simular la experiencia de usuario dentro del ecosistema Citronela. El objetivo es validar la funcionalidad y el flujo visual sin incurrir en costos de desarrollo de backend en esta etapa.

## Scope

### In Scope
- Nueva ruta funcional `/foro` optimizada para Mobile-First.
- Implementación de un **Frontend-Only State** para gestionar posts y comentarios en la sesión actual.
- Layout inspirado en referencias de alta densidad (Vikinger) pero con la **Identidad Visual de Citronela** (Glassmorphism, ciber-industrial, lime-400).
- Sistema de filtros por categorías ('Investigaciones', 'Papers', 'Debates', etc.).
- Modal de creación de posts con validación visual.
- Transiciones fluidas con GSAP para la navegación entre el feed y el detalle de posts.

### Out of Scope
- Integración con base de datos (PostgreSQL/Drizzle).
- Rutas de API reales.
- Sistema de Tokens y gamificación.
- Persistencia de datos entre diferentes dispositivos o limpiezas de caché.

## Approach
Se utilizará un patrón de **Mock State** en el nivel superior de la página `/foro`. Los datos se inicializarán con un set de posts de ejemplo y se actualizarán en memoria mediante hooks de React. El diseño seguirá estrictamente el sistema de diseño ya establecido en `components/market` y `components/cultivo`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/(app)/community/` | Removed | Eliminación de la ruta vieja y lógica de DB. |
| `app/(app)/foro/` | New | Nueva ruta para el Citroforo Mockup. |
| `components/community/` | Modified | Reemplazo total de componentes por versiones mock-ready. |
| `app/api/posts/` | Removed | Eliminación de rutas de API innecesarias para la maqueta. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Confusión de datos | Medium | Indicar visualmente que es una "Versión de Prueba - Sin Persistencia". |
| Desvío estético | Low | Referenciar constantemente componentes de `market` y `cultivo`. |

## Rollback Plan
El código anterior se encuentra en el historial de Git. Para revertir, basta con hacer un `git checkout` de las carpetas eliminadas.

## Success Criteria
- [ ] El usuario puede navegar por el feed de posts en mobile sin lag.
- [ ] Se puede crear un post y verlo aparecer instantáneamente en la lista.
- [ ] Los filtros de categorías funcionan y actualizan la vista sin recargar la página.
- [ ] La estética es indistinguible de la pestaña "Mi Cultivo".
