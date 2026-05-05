# Foro Specification (Visual Shell)

## Purpose
Definir el comportamiento esperado para la maqueta funcional del Citroforo, centrada en la experiencia visual, la navegación fluida y la simulación de interactividad sin persistencia en base de datos.

## Requirements

### Requirement: Navegación de Feed
El sistema **DEBE** mostrar una lista de publicaciones (posts) siguiendo el layout de "Feed Social" optimizado para dispositivos móviles.

#### Scenario: Visualización Inicial
- GIVEN que el usuario accede a `/foro`
- WHEN la página carga
- THEN el sistema **DEBE** mostrar un set de posts precargados (mock data)
- AND cada post **DEBE** mostrar: avatar, nombre, categoría, título, resumen y reacciones.

### Requirement: Detalle de Publicación
El sistema **DEBE** permitir la visualización expandida de un post al hacer click sobre el mismo, sin realizar recargas de página completas.

#### Scenario: Apertura de Post
- GIVEN el usuario está en el feed
- WHEN hace click en un post
- THEN el sistema **DEBE** mostrar el detalle completo (contenido extendido y comentarios mock).

### Requirement: Creación de Publicación (Mock)
El sistema **DEBE** permitir al usuario simular la creación de un nuevo post mediante un modal.

#### Scenario: Crear nuevo post
- GIVEN el usuario abre el modal de creación
- WHEN completa el título, contenido y categoría, y presiona "Publicar"
- THEN el sistema **DEBE** cerrar el modal
- AND el nuevo post **DEBE** aparecer al principio del feed instantáneamente.

### Requirement: Filtrado por Categoría
El sistema **DEBE** filtrar la lista de posts basándose en la categoría seleccionada por el usuario.

#### Scenario: Cambio de Categoría
- GIVEN el feed con múltiples categorías
- WHEN el usuario selecciona "Papers" en la barra de filtros
- THEN el sistema **DEBE** mostrar únicamente los posts de esa categoría.

### Requirement: Comentarios en Publicaciones
El sistema **DEBE** permitir a los usuarios agregar comentarios a cualquier publicación existente.

#### Scenario: Agregar un comentario
- GIVEN el usuario está viendo el detalle de un post
- WHEN escribe un mensaje en el campo de comentarios y presiona "Enviar"
- THEN el sistema **DEBE** agregar el comentario al final de la lista de comentarios del post
- AND el comentario **DEBE** visualizarse inmediatamente sin recargar la página.

### Requirement: Persistencia Local (LocalStorage)
El sistema **DEBE** persistir el estado del foro (posts creados y comentarios) en el almacenamiento local del navegador.

#### Scenario: Recarga de Página
- GIVEN que el usuario creó un post o comentario
- WHEN recarga la página o cierra el navegador y vuelve a entrar
- THEN el sistema **DEBE** recuperar los datos del `localStorage`
- AND mostrar el estado actualizado tal como quedó antes de cerrar.

### Requirement: Responsive Mobile-First
La interfaz **DEBE** ser 100% funcional en dispositivos móviles y **SHOULD** expandirse a un layout multi-columna en Desktop.

#### Scenario: Vista Desktop
- GIVEN una resolución de pantalla > 1024px
- WHEN el usuario visualiza el foro
- THEN el sistema **DEBE** mostrar una barra lateral izquierda de navegación y widgets de estadísticas a la derecha.
