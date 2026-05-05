# Tasks: Citroforo Visual Shell

- [ ] **Setup: Cleaning legacy**
    - [ ] Eliminar `app/(app)/community/page.tsx`.
    - [ ] Eliminar `app/api/community/route.ts` (si existe).
    - [ ] Crear estructura de carpetas en `components/foro`.

- [ ] **Feature: Data & State**
    - [ ] Definir interfaces de `ForumPost` y `ForumComment` en `types/forum.ts`.
    - [ ] Crear hook `useForumState` con persistencia en `localStorage`.
    - [ ] Generar set de datos iniciales (Mock Data) con estética Citronela.

- [ ] **UI: Core Components**
    - [ ] Implementar `CategoryFilter.tsx` (estilo Citromarket).
    - [ ] Implementar `ForumPostCard.tsx` (estilo Ciber-industrial).
    - [ ] Implementar `ForumFeed.tsx` (lista principal mobile-first).

- [ ] **UI: Interaction Components**
    - [ ] Implementar `CreatePostModal.tsx` usando Radix/Shadcn.
    - [ ] Implementar `ForumPostDetail.tsx` (vista expandida con comentarios).
    - [ ] Integrar sistema de comentarios en el estado local.

- [ ] **Page Assembly**
    - [ ] Construir `app/(app)/foro/page.tsx` integrando todos los componentes.
    - [ ] Asegurar que el layout respete los gradientes y el grid global.

- [ ] **Final Review (Checklist para el Usuario)**
    - [ ] Verificar que los posts carguen al entrar.
    - [ ] Verificar que al crear un post se vea arriba de todo.
    - [ ] Verificar que al refrescar la página no se borre lo creado.
    - [ ] Verificar que los comentarios se agreguen correctamente.
