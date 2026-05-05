# Citroforo & Tokenomía: Roadmap de Avances

## ✅ Sesión Actual (Hitos Completados)

### 1. Sistema de Comunidades (Foro)
- **Community Header Dinámico**: Implementación de headers premium con banners y metadata específica por categoría.
- **Categorización "Comunidades"**: Refactorización de filtros estáticos a un selector de comunidades con iconos y descripciones.
- **Bookmarking Global**: Sistema de guardado de posts funcional y persistente en Feed, Detalle y Perfil.

### 2. Perfil de Usuario "Master Control Center"
- **Pestaña de Actividad**: Desglose de Posts, Comentarios realizados y Likes otorgados.
- **Pestaña de Billetera**: Visualización de saldo de tokens y historial detallado de transacciones (ingresos/gastos).
- **Pestaña de Mis Eventos**: Gestión de entradas adquiridas con visualización de QR y estado de reserva.

### 3. Simulador de Login & Tokenomía
- **Login Terminal Experience**: Interfaz cinemática de acceso estilo Citro_OS para inicializar la identidad del usuario.
- **Hook `useUser`**: Gestión centralizada de estado, saldo, historial y reservas con persistencia en `localStorage`.
- **Checkout de Market**: Conexión de la terminal de canje con el saldo real del usuario y registro de transacción.
- **Checkout de Eventos**: Integración del selector de entradas con el sistema de tokens y generación automática de tickets.

---

## 🚀 Próximos Pasos (Roadmap Pendiente)

### Fase 4: Gamificación & Karma
- **Sistema de Niveles**: Desbloqueo de rangos (Cultivador, Experto, Leyenda) basado en el Karma acumulado.
- **Logros (Badges)**: Medallas visuales en el perfil por hitos alcanzados (primer post, 100 likes recibidos, etc.).

### Fase 5: Marketplace Avanzado
- **Carrito de Compras Multiproducto**: Permitir el canje de múltiples ítems en una sola transacción.
- **Seguimiento de Canje**: Interfaz para ver el estado del envío/preparación de los productos canjeados.

### Fase 6: Refactor de Assets & Producción
- **Migración de Imágenes**: Mover banners de comunidades de rutas locales a `/public/images/foro/`.
- **Optimización de GSAP**: Pulir transiciones en el checkout para dispositivos móviles de gama baja.

---
**Nota Técnica**: La persistencia actual se basa en `localStorage`. Para una fase posterior, se recomienda la integración con una base de datos real o Firebase para multi-dispositivo.
