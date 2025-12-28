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
- **MCP Native**: Servidor MCP integrado y estandarizado (vía `mcp-handler`) para consumo inmediato desde cualquier cliente compatible.
- **Discovery Endpoint**: Soporte para `/.well-known/mcp-configuration` (vía rewrite en `next.config.ts`) para autoconfiguración de clientes.

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
- `src/app/api/mcp/config`: Lógica del endpoint de descubrimiento.
- `src/app/api/mcp/[transport]`: Punto de entrada unificado para el protocolo MCP.

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
