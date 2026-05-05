# Propuesta: Centro de Control de Perfil

## Intención

Implementar una página dedicada "Mi Perfil" para centralizar la info del usuario, el balance de tokens, el historial de actividad y los ajustes. Esto cierra el círculo de la experiencia de usuario dándole un espacio personal dentro del ecosistema Citronela.

## Alcance

### Entra en juego
- Ruta dedicada `/profile`.
- Header de usuario siguiendo la convención "Ultra-Black".
- Visualización del balance de tokens y resumen del historial.
- Resumen de cultivos activos (con link a Cultivo).
- Feed de actividad reciente (compras en el Market, registros a Eventos).
- Ajustes básicos (notificaciones, nombre visible).

### Queda afuera
- Perfil social público para otros usuarios.
- Gestión avanzada de métodos de pago o facturación.
- Ajustes de seguridad complejos (2FA).

## Enfoque

Vamos a crear una página nueva en `app/(app)/profile/page.tsx` usando el patrón de layout que ya tenemos (Header verde sólido + Contenido principal). Usamos el `UserContext` para la data en tiempo real y hooks de prueba para el historial.

## Áreas Afectadas

| Área | Impacto | Descripción |
|------|--------|-------------|
| `app/(app)/profile/page.tsx` | Nueva | Punto de entrada principal para la página de perfil |
| `components/features/profile/` | Nueva | Carpeta para los componentes específicos del perfil |
| `hooks/useProfile.ts` | Nuevo | Hook para traer la data relacionada al perfil |

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|------|------------|------------|
| Inconsistencia visual con otros módulos | Baja | Seguir a rajatabla el layout y los tokens de diseño existentes |
| Lag en la carga de data | Media | Usar skeletons y UI optimista para los ajustes |

## Plan de Retirada (Rollback)

Borramos la carpeta `app/(app)/profile` y los componentes relacionados.

## Dependencias

- `UserContext` para la data core del usuario.
- `Lucide React` y `Material Symbols` para la iconografía.

## Criterios de Éxito

- [ ] Se puede entrar desde la navegación.
- [ ] Muestra el balance de tokens y el nombre de usuario correctamente.
- [ ] El diseño encaja perfecto con el sistema de Citronela 2026.
