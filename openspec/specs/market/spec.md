# Marketplace Specification

## Purpose
Definir el comportamiento del Mercado GTL, asegurando una experiencia de usuario fluida, asíncrona y con alta fidelidad visual.

## Requirements

### Requirement: Async Data Loading
El sistema DEBE cargar los productos de forma asíncrona para permitir la visualización de estados de carga (skeletons).

#### Scenario: Carga exitosa con delay
- GIVEN el usuario navega a la pestaña Marketplace
- WHEN el hook de productos se inicializa
- THEN el sistema DEBE mostrar skeletons con efecto shimmer por al menos 800ms
- AND los productos DEBEN aparecer gradualmente una vez completada la carga

### Requirement: Product Filtering
El sistema DEBE permitir filtrar productos por categoría y término de búsqueda de forma reactiva.

#### Scenario: Búsqueda sin resultados
- GIVEN una lista de productos cargada
- WHEN el usuario escribe un término que no coincide con ningún producto
- THEN el sistema DEBE mostrar un estado vacío (Empty State) con estética glass-surface
- AND DEBE incluir una ilustración o icono de búsqueda vacía

### Requirement: Modular Cart Logic
El sistema DEBE gestionar el carrito de compras de forma aislada a la UI principal.

#### Scenario: Agregar producto al carrito
- GIVEN un producto con stock disponible
- WHEN el usuario hace clic en "Agregar al carrito"
- THEN el sistema DEBE actualizar el contador del carrito en el header
- AND DEBE mostrar una notificación toast de éxito
