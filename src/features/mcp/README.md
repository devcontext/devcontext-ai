# 🔌 MCP Feature (Model Context Protocol)

Este módulo implementa el Model Context Protocol para exponer los contextos gestionados en DevContext AI a herramientas externas de IA (Cursor, Claude Desktop, Antigravity, etc.).

## 🚀 Resumen

Permite que cualquier LLM con soporte para MCP pueda "leer" tus contextos de IA directamente desde la API del proyecto, manteniéndolos siempre actualizados sin necesidad de copiar y pegar manualmente.

## 🏗️ Arquitectura

El módulo sigue el patrón `Action -> Service -> Repo` definido en el proyecto:

- **Services**: `McpService` gestiona la lógica de recursos y `McpExecutor` (MVP) orquesta la ejecución.
- **Utils**: `requireAccessToken` para validación segura mediante tokens de acceso.
- **API**: Expuesto en `/api/mcp/http` (Transporte HTTP JSON-RPC 2.0).
- **Types**: Definiciones de `McpResourceEntry` y `McpResourceContent`.

## 📂 Estructura del Módulo

```text
src/features/mcp/
├── components/          # Snippets de configuración para la UI
├── services/            # Lógica de negocio (McpService, McpExecutor)
├── types/               # Tipos compartidos del protocolo
└── utils/               # Utilidades de autenticación (HMAC-SHA256)
```

## 🛠️ Uso y Métodos Soportados (MVP)

### Métodos JSON-RPC 2.0

- `initialize`: Negociación inicial del protocolo.
- `resources/list`: Lista todos los contextos del usuario como recursos.
- `resources/read`: Lee el contenido Markdown de un contexto específico (`context://<id>`).
- `tools/list`: Expone la herramienta `get_context`.
- `tools/call`: Ejecuta `get_context` para obtener contenido por ID.

### Endpoint

`POST /api/mcp/http`

## 🔒 Seguridad

Todas las peticiones requieren un `AccessToken` válido en las cabeceras:

```http
Authorization: Bearer <your_token>
```

Los tokens se pueden gestionar desde el dashboard de usuario.

## ⚙️ Configuración en Clientes

### Cursor

Añadir a Settings → Features → MCP:

- **Name**: DevContext AI
- **Type**: HTTP
- **URL**: `https://your-domain.com/api/mcp/http`
- **Headers**: `{"Authorization": "Bearer <TOKEN>"}`

### Claude Desktop

Añadir al archivo de configuración:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "url": "https://your-domain.com/api/mcp/http",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer <TOKEN>"
      }
    }
  }
}
```

---

> [!NOTE]
> Este módulo está en fase MVP. Actualmente está optimizado para lectura de contextos.
