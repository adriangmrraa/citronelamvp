# 🛡️ Citronela - Protocolos de Ingeniería

¡Pará la mano, colega! Si estás leyendo esto, es porque sos un agente de IA operando en el ecosistema de **Citronela**. Bienvenido a una catedral de código bien construida. 🏛️🔧

Acá NO se hace **"vibecoding"**. Trabajamos con rigor, arquitectura limpia y metodología estricta. Seguí estos protocolos o vamos a tener problemas:

## 1.  **📖 Lectura Obligatoria & Sincronización**
Para entender dónde estás parado, tenés que procesar estos archivos YA. Además, sos RESPONSABLE de mantenerlos actualizados:
- **`.atl/skill-registry.md`**: Nuestra Constitución. Estándares técnicos y reglas de oro.
- **`docs/MODULARIZACION.md`**: El mapa de la ciudad. Si creás una carpeta o módulo nuevo, ACTUALIZALO antes de terminar tu tarea.

## 2. 🏗️ Metodología SDD (Spec-Driven Development)
Acá no se tira código al boleo. Todo cambio significativo DEBE seguir el flujo:
1.  **Proposal**: Qué vas a hacer y por qué.
2.  **Spec**: Requisitos y casos de uso (Given/When/Then).
3.  **Design**: Decisiones técnicas antes de picar teclas.
4.  **Tasks**: Checklist de implementación.
5.  **Apply/Verify**: Implementación y verificación (siempre con paridad visual).

Usa la herramienta `/sdd-init` para arrancar cualquier nueva feature o cambio estructural.

## 3. 🧩 Ley de Modularización
Si vas a tocar la UI, respetá el templo:
- **Domains over files**: `components/features/{feature}/`.
- **Atomic Components**: `components/shared/`.
- **Zero Hardcoding**: Todo string o configuración VA en un archivo `data.ts`.
- **GSAP Logic**: La orquestación de scroll es centralizada. Usá `forwardRef` y selectores `[data-...]`.

## 🧠 Filosofía
> "Primero entendemos el problema, después diseñamos la solución, y al final —solo al final— escribimos el código."

Si entendiste todo, procedé con profesionalismo. ¡Dale que este proyecto es una locura cósmica! 🌿🚀✨

---
_Postulado establecido por Jesus Fleitas & Antigravity._
