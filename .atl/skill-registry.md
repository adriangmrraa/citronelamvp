# 📜 Skill Registry — Citronela Project

Este documento es la **Constitución del Proyecto**. Cualquier agente (IA o Humano) que trabaje en este repositorio DEBE seguir estas reglas sin excepción para garantizar la integridad arquitectónica y el éxito del SDD.

## 🚀 Project Skills & Stack

| Skill | Trigger | Context / Purpose |
|-------|---------|-------------------|
| **sdd-strict** | Siempre activo | Metodología obligatoria para cualquier cambio funcional o arquitectónico. |
| **frontend-modular** | Cambios en UI | Patrones de modularización, GSAP y estilos. |
| **neon-postgres** | Base de Datos | Operaciones con Neon DB y Drizzle ORM. |

---

## 🛠️ Tech Stack & Standards

- **Core**: Next.js 14+ (App Router), TypeScript (Strict Mode).
- **Styling**: Tailwind CSS (Mobile-first, Utility-first). No usar CSS-in-JS.
- **Animations**: GSAP (GreenSock) para orquestación compleja de scroll. Lenis para smooth scroll.
- **State Management**: React Context / Hooks para estado local. Signals/Redux si la complejidad escala.
- **Architecture**: Modularización por dominios (`features/`) y componentes atómicos (`shared/`).

---

## ⚖️ Reglas Inquebrantables (Invariants)

### 1. Metodología SDD (Spec-Driven Development)
## 🛠️ Reglas de Oro (Sovereign Rules)

1.  **SDD First**: Prohibido editar archivos sin una propuesta (`proposal`) y especificación (`spec`) previa. Usa `/sdd-init` o `/sdd-new`.
2.  **Modularidad Radical**: Prohibido crear archivos de más de 400 líneas. Si crece mucho, refactorizá y extraé componentes/hooks. 🧩
3.  **Documentación Viva**: Es OBLIGATORIO actualizar `docs/MODULARIZACION.md` al finalizar cualquier cambio que altere la estructura de carpetas o cree nuevos módulos de datos. 📖
4.  **Exploración Activa**: Ningún agente debe confiar 100% en la documentación estática. El primer paso de cada sesión es ejecutar una exploración de archivos (`ls -R` o similar) para detectar desviaciones entre el mapa y el territorio. 🛰️
5.  **Named Exports**: Siempre usar exportaciones nombradas para mantener consistencia y facilitar el refactoring. 🏷️

### 2. Arquitectura de Componentes
- **Strict Modularization**: New UI logic must be extracted into `components/shared` (atomic) or `components/features/{feature}/` (domain) following the patterns established.
- **Documentation First**: Any agent working on UI MUST read `docs/MODULARIZACION.md` before making changes to understand the existing component hierarchy and orchestration.
- **No Monoliths**: Components must remain focused and modular. Avoid bloat; if a component manages too many responsibilities, split it.
- **GSAP Sync**: Global scroll orchestration must reside in the parent/orchestrator using `forwardRef` and `data-attributes`.
- **Static Data**: All strings, constants, and config must reside in a `data.ts` file within the feature folder.

### 3. Orquestación GSAP & Animaciones
- **Single Source of Truth**: La orquestación de `ScrollTrigger` reside en el componente padre/orquestador (`LandingPage.tsx`).
- **Data-Attributes**: Usar selectores `[data-...]` para animaciones, evitando el acoplamiento con clases CSS o IDs.
- **Cleanup**: Siempre limpiar los efectos de GSAP en el `unmount` usando `gsap.context()`.

### 4. Gestión de Contenido (Static Data)
- **Zero Hardcoding**: Prohibido escribir textos largos o configuraciones de arrays dentro del JSX.
- Toda la data estática debe residir en un archivo `data.ts` dentro de la carpeta del feature correspondiente.

---

## 📖 Convenciones de Proyecto

| Archivo / Carpeta | Propósito |
|-------------------|-----------|
| `docs/MODULARIZACION.md` | Mapa detallado de la arquitectura modular actual. |
| `.atl/skill-registry.md` | Este archivo (Registro de habilidades y normas). |
| `components/shared/` | Componentes transversales (Botones, Orbes, Containers). |
| `data.ts` | Almacén de constantes y textos por feature. |

---

## ⚠️ Compact Rules for Agents

### sdd-strict
- Always read the latest task list before starting.
- Never skip the `design` phase for UI changes.
- Verify parity with screenshots after every `apply` phase.

### frontend-modular
- When creating a new section, implement it in `components/features/landing/sections/`.
- Use `named exports` exclusively for components to improve tree-shaking and lazy loading consistency.
- Maintain visual harmony using the defined color palette in Tailwind config.

---
_Jesus Fleitas - Project Lead & Architect_
