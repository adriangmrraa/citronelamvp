# Guía de Modularización: LandingPage (Branch Master)

Esta guía detalla los pasos para refactorizar el componente monolítico `LandingPage.tsx` en una estructura modular, manteniendo la lógica de animaciones GSAP y paridad visual total.

### Paso 1: Extracción de UI Atómica (Shared)
Crear los siguientes componentes en `components/shared/` extrayendo el código desde `LandingPage.tsx`:
- `AnimatedOrb.tsx`: Componente de los fondos dinámicos con blur.
- `BgImage.tsx`: Utilidad de imagen con soporte para parallax.
- `LeafIcon.tsx`: Asset SVG del logo centralizado.

### Paso 2: Desacoplamiento de Datos
Crear `components/features/landing/data.ts` y mover allí toda la información estática:
- Extraer arrays: `features`, `marketplaceItems`, `communityPosts`.
- Extraer objetos de configuración como `panelConfig` (mockup del teléfono).
- Centralizar todos los textos (Hero, descripciones, labels).

### Paso 3: Modularización de Pantallas Interactivas
Crear la carpeta `components/features/landing/screens/` y separar las vistas del mockup del teléfono:
- `DashboardScreen.tsx`: Métricas y resumen.
- `CultivoScreen.tsx`: Logs de nutrientes.
- `MarketScreen.tsx`: Listado de semillas.
- `CommunityScreen.tsx`: Feed social.

### Paso 4: Fragmentación de Secciones de Landing
Dividir el JSX principal de `LandingPage.tsx` en componentes aislados bajo `components/features/landing/`:
- `Header.tsx`, `Hero.tsx`, `FeaturesGrid.tsx`, `HorizontalShowcase.tsx`, `EcosystemBand.tsx`, `CTA.tsx` y `Footer.tsx`.

### Paso 5: Reensamblaje y Orquestación de Animaciones
Refactorizar el archivo `LandingPage.tsx` para que actúe como controlador de alto nivel:
- Importar las secciones y pantallas creadas.
- Mantener la lógica de GSAP (`useLayoutEffect`, `ScrollTrigger`) y Lenis en este archivo único.
- Pasar referencias (`refs`) a los hijos utilizando `forwardRef` para que el orquestador mantenga el control de los timelines de animación sin fragmentar la lógica de scroll.

### Paso 6: Verificación de Paridad
Auditar el resultado final contra la versión monolítica original para garantizar:
- Fidelidad de textos, emojis y placeholders extraídos a `data.ts`.
- Correcto funcionamiento de las animaciones ligadas al scroll horizontal.
