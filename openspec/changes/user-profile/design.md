# Diseño: Centro de Control de Perfil

## Enfoque Técnico

Vamos a implementar la página de perfil como un componente de cliente de Next.js para aprovechar el estado en tiempo real del `UserContext`. La página va a seguir el layout establecido en Citronela: un header verde sólido para la identidad core (Nombre, Tokens, Nav) y un área principal con fondo oscuro para la actividad y los ajustes.

## Decisiones de Arquitectura

### Decisión: Gestión de Estado

**Elección**: Usar `UserContext` de forma exclusiva para la data core del usuario.
**Alternativas consideradas**: Redux, fetching individual por componente.
**Razón**: El `UserContext` ya está andando y se usa en todos los headers. Nos asegura que el balance de tokens sea el mismo en todos lados.

### Decisión: Estructura de Componentes

**Elección**: Componentes atómicos para las secciones del perfil (ActivityItem, SettingToggle).
**Alternativas consideradas**: Un solo componente monolítico para toda la página.
**Razón**: Facilita el mantenimiento y permite meter skeletons de carga individuales.

## Flujo de Datos

El `UserContext` nos da el `username` y los `tokens`. 
Un hook nuevo `useProfile` va a traer el historial de actividad desde data de prueba (mocks).

    UserContext ──→ ProfilePage ──→ Header (Muestra Identidad)
                       │
                       └──────────→ ActivityFeed (Trae via useProfile)
                       │
                       └──────────→ SettingsGrid (Estado Local + Persistencia)

## Cambios en Archivos

| Archivo | Acción | Descripción |
|------|--------|-------------|
| `app/(app)/profile/page.tsx` | Crear | Layout principal y lógica de la página |
| `components/features/profile/ProfileHeader.tsx` | Crear | Componente de header específico para el perfil |
| `components/features/profile/ActivityFeed.tsx` | Crear | Lista de acciones recientes del usuario |
| `components/features/profile/SettingsGrid.tsx` | Crear | Grilla con los ajustes y preferencias |
| `hooks/useProfile.ts` | Crear | Hook para el historial y metadata del perfil |

## Interfaces / Contratos

```typescript
export interface ProfileActivity {
  id: string;
  type: 'purchase' | 'post' | 'event' | 'token_earn';
  title: string;
  date: string;
  amount?: string;
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  newsletter: boolean;
}
```

## Estrategia de Testing

| Capa | Qué testear | Enfoque |
|-------|-------------|----------|
| Unit | Hook `useProfile` | Probar la carga de data y el filtrado |
| Component | `SettingsGrid` | Verificar que los toggles actualicen el estado |
| E2E | Navegación al Perfil | Asegurar que el link del sidebar ande y la página renderice |

## Migración / Despliegue

No hace falta migración. Es una funcionalidad nueva.
