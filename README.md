# DevContext AI — Context Control Plane

> **Diseñar, curar y gobernar el contexto de la IA de forma deliberada.**

DevContext AI es una plataforma de **ingeniería de contexto** diseñada para que desarrolladores individuales (solo-devs) puedan crear, versionar y exponer contexto explícito a sus herramientas de IA (Cursor, Claude Desktop, etc.) de forma predecible y consistente.

---

## 🚀 ¿Por qué DevContext?

Los desarrolladores rara vez sufren porque la IA sea "poco inteligente". Sufren porque la IA **no tiene un contexto estable ni límites claros**.

Este proyecto resuelve la ausencia de contexto explícito convirtiendo el conocimiento bruto del proyecto en **contratos de ejecución** que la IA puede respetar de forma fiable, eliminando la necesidad de reescribir prompts repetitivos.

## ✨ Características Principales

- **Context Composer**: Crea borradores de contexto guiados a partir de documentos, código o texto plano.
- **Contextos Versionados**: Cada guardado es una versión. Restaurará cualquier punto en el tiempo y mantén la evolución de tus reglas de arquitectura.
- **MCP Native**: Servidor MCP integrado con soporte para HTTP transport, compatible con Cursor, Claude Desktop, Antigravity y otros clientes MCP.
- **API Segura**: Autenticación mediante API keys para control de acceso granular.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Lenguaje**: TypeScript (Strict Mode)
- **Base de Datos**: Supabase (Auth + PostgreSQL)
- **MCP Adapter**: `mcp-handler`
- **UI**: Vanilla CSS + React 19

---

## 🏁 Empezando

### 1. Requisitos previos

- Node.js 20+
- pnpm (v9+)
- Una instancia de Supabase configurada.

### 2. Instalación

```bash
pnpm install
```

### 3. Configuración local

Copia el archivo `.env.example` a `.env.local` y rellena las credenciales de Supabase:

```bash
cp .env.example .env.local
```

### 4. Desarrollo

```bash
pnpm dev
```

### 5. Despliegue en Vercel

El proyecto está optimizado para Vercel. Asegúrate de configurar las variables de entorno (`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, etc.).

---

## 🧭 Estructura del Proyecto

El proyecto sigue una arquitectura **Feature-Based** con separación clara de capas:

- `src/features/core/domain`: Lógica pura, determinística y sin efectos secundarios.
- `src/features/core/infra`: Adaptadores de base de datos y clientes externos.
- `src/features/core/app`: Orquestación de casos de uso e integración.
- `src/app/api/mcp/http`: Endpoint HTTP para el protocolo MCP.
- `src/app/api/mcp`: Health check y configuración base.

---

## 🔌 Configuración MCP

DevContext AI expone un servidor MCP (Model Context Protocol) que permite a editores e IDEs acceder al contexto de tus proyectos de forma nativa.

### Endpoint

```
https://your-domain.vercel.app/api/mcp/http
```

### Autenticación

Todas las peticiones requieren un API key en el header `Authorization`:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Configuración por IDE

#### Cursor

Abre la configuración de MCP en Cursor y añade:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "transport": "http",
      "url": "https://your-domain.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Ver ejemplo completo: [`docs/examples/cursor-mcp-config.json`](docs/examples/cursor-mcp-config.json)

#### Antigravity (Google Gemini)

Edita `~/.gemini/antigravity/mcp_config.json`:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "serverUrl": "https://your-domain.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

**Nota**: Antigravity usa `serverUrl` en lugar de `url` + `transport`.

Ver ejemplo completo: [`docs/examples/antigravity-mcp-config.json`](docs/examples/antigravity-mcp-config.json)

#### Claude Desktop

Edita el archivo de configuración según tu sistema operativo:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "url": "https://your-domain.vercel.app/api/mcp/http",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Ver ejemplo completo: [`docs/examples/claude-desktop-config.json`](docs/examples/claude-desktop-config.json)

#### Winsurf / VS Code (con extensión MCP)

Añade a tu configuración de workspace (`.vscode/settings.json`):

```json
{
  "mcp.servers": {
    "devcontext-ai": {
      "url": "https://your-domain.vercel.app/api/mcp/http",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Generar API Key

1. Accede al dashboard de DevContext AI
2. Ve a **Settings** → **API Keys**
3. Haz clic en **Generate New Key**
4. Copia la key (solo se muestra una vez)
5. Úsala en la configuración de tu IDE

### Verificar Conexión

Prueba que el servidor responde:

```bash
curl https://your-domain.vercel.app/api/mcp/http \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Respuesta esperada:

```json
{
  "name": "DevContext AI MCP Server",
  "version": "1.0.0",
  "protocol": "2024-11-05",
  "transport": "http"
}
```

---

## 📄 Documentación Crítica

- [PRODUCT_VISION.md](docs/PRODUCT_VISION.md): El "por qué" y los principios de diseño.
- [MVP.md](docs/MVP.md): Alcance actual y objetivos de validación.
- [DECISIONS.md](docs/DECISIONS.md): Registro de decisiones arquitectónicas.
- [CORE_CONCEPTS.md](docs/core/CORE_CONCEPTS.md): El lenguaje fundamental del sistema.

---

## 🛤️ Roadmap

- **NOW**: Context Composer Beta + Exposición MCP.
- **NEXT**: Detección de conflictos de contexto y plantillas de borrador.
- **LATER**: Extensión de VS Code y capa de comandos avanzada.

---

> "No le decimos a la IA qué hacer. Le decimos qué no puede hacer."
