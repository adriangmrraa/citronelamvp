# Design: Citroforo Visual Shell

## Technical Approach
Implementación de una arquitectura de estado local para simular un foro dinámico sin persistencia de backend. Se utilizará un patrón de **Stateful Container** en la página principal del foro para gestionar el set de datos mockeados y las interacciones.

## Architecture Decisions

| Component | Decision | Rationale |
|-----------|----------|-----------|
| **State Management** | React `useState` + `useEffect` (LS Sync) | Suficiente para una maqueta funcional. El sync con `localStorage` garantiza persistencia local para el cliente. |
| **Animation Engine** | Deferred (CSS Transitions only) | Se prioriza la funcionalidad y estructura. Las animaciones GSAP complejas se implementarán en una fase final de pulido global. |
| **UI Components** | Radix (via Shadcn) | Velocidad de desarrollo y accesibilidad garantizada para modales y dropdowns. |
| **Data Flow** | Unidirectional Top-Down | La página `foro/page.tsx` actúa como SSOT (Single Source of Truth) para la lista de posts. |

## Data Flow

```
[Page: /foro] ───> [ForumState] (Initial Mock Data)
      │                │
      ├─> [CategoryFilter] ───> Updates Filter State ───> Re-renders Feed
      ├─> [ForumFeed] ────────> Maps through Filtered Posts
      └─> [CreatePostModal] ──> Dispatches 'addPost' ───> Updates ForumState
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/(app)/foro/page.tsx` | Create | Punto de entrada principal con la lógica de estado y layout base. |
| `components/foro/ForumFeed.tsx` | Create | Componente contenedor de la lista de posts con animaciones GSAP. |
| `components/foro/ForumPostCard.tsx` | Create | Representación visual de un post con el estilo ciber-industrial. |
| `components/foro/CategoryFilter.tsx` | Create | Barra de navegación superior con filtros por tag. |
| `components/foro/CreatePostModal.tsx` | Create | Modal para simular la entrada de nuevos datos. |
| `app/(app)/community/page.tsx` | Delete | Limpieza de la implementación anterior basada en DB. |
| `app/api/community/route.ts` | Delete | Eliminación de endpoints de backend obsoletos para el mockup. |

## Interfaces / Contracts

```typescript
interface ForumComment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: string;
}

interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'Expert' | 'User' | 'Staff';
  };
  category: 'Investigación' | 'Papers' | 'Debate' | 'Anuncio';
  title: string;
  content: string;
  image?: string;
  stats: {
    likes: number;
    views: number;
  };
  comments: ForumComment[];
  createdAt: string;
}
```

## Testing Strategy

| Layer | Responsibility | Approach |
|-------|---------------|----------|
| **Manual (UX)** | **Usuario** | Verificación de flujos en dispositivos reales y DevTools. |
| **Functional** | **Usuario** | Validación de persistencia en `localStorage` y creación de comentarios. |

**Nota**: El agente no realizará pruebas automáticas con Puppeteer en esta fase para optimizar tiempos. El usuario reportará cualquier desvío visual o funcional.

## Migration / Rollout
No se requiere migración de datos. Es un reemplazo destructivo de la pestaña "Comunidad" actual por la nueva pestaña "Foro".

## Open Questions
- [ ] ¿Deberíamos persistir los posts creados en `localStorage` para que no se borren al refrescar? (Sugerido para mejorar la sensación de demo).
- [ ] ¿El usuario debe poder comentar en esta fase? (Propuesto: Comentarios estáticos fijos).
