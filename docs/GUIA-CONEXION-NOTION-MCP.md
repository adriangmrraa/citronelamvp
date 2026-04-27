# Instrucciones para Agente: Implementación de Notion MCP

Hola, colega. Estas instrucciones son para que configures y operes el **Servidor MCP de Notion** en el entorno de desarrollo actual. Seguí estos pasos para habilitar el acceso a la base de conocimientos y proyectos del equipo.

## 1. Obtención del Token (Acción del Humano)
Para que esto funcione, el usuario debe proporcionarte un **Notion Internal Integration Token**.
1. Ir a [Notion My Integrations](https://www.notion.com/my-integrations).
2. Crear una nueva integración (por ejemplo, llamada "Antigravity Agent").
3. Copiar el `Internal Integration Secret` (comienza con `ntn_`).
4. **IMPORTANTE**: El usuario debe compartir las páginas o bases de datos específicas con esta integración en Notion (En la página de Notion, ir al menú de los 3 puntos arriba a la derecha `...` -> `Connections` -> `Add connection` -> buscar el nombre de la integración).

## 2. Configuración del Servidor MCP
Debés configurar el servidor en los ajustes de tu cliente MCP (`mcp_config.json`). La configuración técnica correcta y verificada es:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "TU_TOKEN_ACA"
      }
    }
  }
}
```

*Nota crucial*: El paquete correcto para usar mediante npx es `@notionhq/notion-mcp-server` (y no bajo el scope de modelcontextprotocol que da error 404). Además, la variable de entorno es `NOTION_TOKEN`, no `NOTION_ACCESS_TOKEN`.

## 3. Capacidades Disponibles
Una vez conectado, tendrás acceso a un conjunto amplio de herramientas. Las herramientas expuestas usan el prefijo `mcp_notion_API-`. Algunas de las más relevantes son:

- `mcp_notion_API-post-search`: Para buscar páginas o bases de datos por título.
- `mcp_notion_API-get-self`: Para verificar la identidad y validez del token de la integración.
- `mcp_notion_API-query-data-source`: Para consultar bases de datos.
- `mcp_notion_API-retrieve-a-page`: Para obtener la información de una página específica.
- `mcp_notion_API-post-page`: Para crear nuevas páginas (se requiere el `page_id` del parent).
- `mcp_notion_API-patch-block-children`: Para añadir bloques (texto, etc.) al final de una página o bloque.
- `mcp_notion_API-update-a-block`: Para actualizar contenido de bloques específicos.

## 4. Protocolo de Operación
1. **Verificación Inicial**: Al arrancar, podés usar `mcp_notion_API-get-self` para asegurar que el token es válido y no da error de autenticación (401).
2. **Búsqueda Proactiva**: Usá `mcp_notion_API-post-search` para ubicar páginas relevantes o parent IDs (padres) donde crear nuevas páginas.
3. **Documentación de Decisiones**: Cada vez que se tome una decisión importante, sugerí documentarla usando `mcp_notion_API-post-page` o añadiendo bloques a páginas existentes.
4. **Mantenimiento**: Si recibís errores de permisos (o no encontrás páginas que deberían estar ahí), recordale al usuario que debe **conectar/compartir** esa página específica con la integración.

---
*Fusa Labs - IA Venture Builder Standards*
