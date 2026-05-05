# Especificaciones del Perfil de Usuario

## Propósito

Definir el comportamiento y los requerimientos para la sección "Mi Perfil" de la plataforma Citronela.

## Requerimientos

### Requerimiento: Acceso al Perfil

El sistema DEBE dar una ruta en `/profile` que sea accesible desde la barra lateral de navegación.

#### Escenario: Navegar al Perfil
- DADO que el usuario está en cualquier página
- CUANDO el usuario hace clic en el link "Mi Perfil" del sidebar
- ENTONCES el sistema DEBE redirigir al usuario a la página `/profile`

### Requerimiento: Muestra de Info del Usuario

El sistema DEBE mostrar el balance de tokens actual, el nombre de usuario y un saludo personalizado en el header.

#### Escenario: Verificar Info del Header
- DADO que el usuario está en la página `/profile`
- ENTONCES el sistema MOSTRARÁ el badge de tokens "Ultra-Black" con el balance correcto
- Y el saludo DEBE coincidir con el nombre del usuario (ej: "Hola, CitroUser!")

### Requerimiento: Feed de Actividad

El sistema DEBERÍA mostrar una lista de actividades recientes, incluyendo compras en el market y posteos en el foro.

#### Escenario: Ver Actividad Reciente
- DADO que el usuario hizo una compra reciente en Citromarket
- CUANDO el usuario mira la página de perfil
- ENTONCES el sistema MOSTRARÁ la compra en la lista de actividad con la fecha y el nombre del producto

### Requerimiento: Gestión de Ajustes

El sistema DEBERÁ permitir que el usuario cambie sus preferencias de notificaciones.

#### Escenario: Actualizar Ajustes de Notificaciones
- DADO que el usuario está en la sección de ajustes del perfil
- CUANDO el usuario toca el switch de "Notificaciones"
- ENTONCES el sistema DEBE guardar el nuevo estado
- Y mostrar un cartelito (toast) de confirmación
