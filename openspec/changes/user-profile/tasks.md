# Tareas: Centro de Control de Perfil

## Fase 1: Infraestructura y Mocks

- [x] 1.1 Crear el hook `hooks/useProfile.ts` con data de prueba para el historial de actividad.
- [x] 1.2 Definir los tipos `ProfileActivity` y `UserSettings` en un nuevo archivo `types/profile.ts`.

## Fase 2: Componentes del Perfil

- [x] 2.1 Crear `components/features/profile/ProfileHeader.tsx` siguiendo el diseño "Ultra-Black".
- [x] 2.2 Crear `components/features/profile/ActivityFeed.tsx` para mostrar el historial del usuario.
- [x] 2.3 Crear `components/features/profile/SettingsGrid.tsx` con los toggles de preferencias.

## Fase 3: Página y Navegación

- [x] 3.1 Crear la página principal en `app/(app)/profile/page.tsx` integrando todos los componentes.
- [x] 3.2 Agregar el link de "Mi Perfil" en el sidebar global de la aplicación.

## Fase 4: Verificación y Pulido

- [x] 4.1 Verificar la responsividad en mobile de la nueva página.
- [x] 4.2 Asegurar que el balance de tokens se actualice en tiempo real al cambiar el `UserContext`.
