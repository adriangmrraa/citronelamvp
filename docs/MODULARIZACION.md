# Reporte de Modularización - Citronela Landing Page

## 🔄 Mantenimiento y Evolución (Living Document)

Este mapa DEBE ser actualizado por cualquier agente o desarrollador que:
1.  **Cree un nuevo dominio**: Agregar la carpeta en la sección de Dominios.
2.  **Mueva componentes**: Reflejar el nuevo path.
3.  **Cambie la estructura de datos**: Si `data.ts` se divide o crece, documentarlo.

### Checklist de Egreso (Post-Implementación)
- [x] ¿La nueva estructura de carpetas coincide con este documento? (Added `public/fonts/avigea`)
- [x] ¿Se agregaron las nuevas pantallas o secciones al mapa?
- [x] ¿Se actualizó la fecha de "Última Sincronización"?

---
**Última Sincronización Arquitectónica:** 24 de Abril, 2026 - *Modularización Inicial & Activos Globales (Fonts)* 🌿✅

Este documento detalla la refactorización realizada para transformar el monolito `LandingPage.tsx` en una arquitectura modular, escalable y mantenible.

## 🏗️ Nueva Estructura de Archivos

Se ha implementado una estructura basada en- `app/`: Directorios de rutas, layout global y estilos base.
- `public/`: Activos estáticos globales.
  - `fonts/`: Tipografías personalizadas (ej. `avigea/`).
- `components/`: El corazón modular del proyecto.
s/shared/`

Componentes atómicos y reutilizables en toda la landing.

- `AnimatedOrb.tsx`: Orbes de fondo con animaciones GSAP.
- `BgImage.tsx`: Manejo de imágenes de fondo con overlays.
- `LeafIcon.tsx`: Elemento decorativo de marca.
- `PhoneMockup.tsx`: Contenedor del dispositivo móvil interactivo.

### 2. `components/features/landing/`

Lógica y componentes específicos de la página principal.

- `data.ts`: **Fuente de verdad única.** Centraliza todos los textos, rutas de imágenes y configuraciones de los paneles.

#### `screens/` (Mockup del Teléfono)

Pantallas interactivas que se renderizan dentro del `PhoneMockup`.

- `DashboardScreen.tsx`
- `CultivoScreen.tsx`
- `MarketScreen.tsx`
- `CommunityScreen.tsx`

#### `sections/` (Secciones de la Página)

Las piezas de construcción de la landing.

- `Header.tsx`
- `Hero.tsx`
- `HorizontalShowcase.tsx`: Galería horizontal con orquestación compleja.
- `FeaturesGrid.tsx`
- `EcosystemBand.tsx`
- `CTA.tsx`
- `Footer.tsx`

## 🧠 Orquestación y Animaciones (GSAP)

Se ha mantenido la lógica de **GSAP**, **ScrollTrigger** y **Lenis** en el componente orquestador principal (`LandingPage.tsx`).

### Puntos Clave:

- **`forwardRef`**: Todas las secciones exportan sus componentes usando `React.forwardRef`. Esto permite que `LandingPage` acceda a los elementos del DOM de cada sección para orquestar las animaciones de scroll.
- **Selectores de Atributos**: Para evitar acoplamiento, GSAP usa selectores de atributos (ej: `[data-panel]`, `[data-hero-text]`) en lugar de depender de la estructura interna del componente.

## ✅ Beneficios Obtenidos

- **Mantenibilidad**: El archivo principal pasó de ~700 líneas a ~230 líneas.
- **Consistencia**: Todos los textos se editan desde un solo lugar (`data.ts`).
- **Performance**: Mejor manejo de `lazy imports` y modularidad de componentes.
- **Escalabilidad**: Es fácil agregar nuevos paneles al showcase horizontal simplemente agregando un objeto en `data.ts` y un nuevo componente en `screens/`.

---

_Documentación generada por Jesus Fleitas_
