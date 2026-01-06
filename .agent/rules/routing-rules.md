---
trigger: always_on
---

# 🧭 ROUTING RULESET — Sistema de Rutas

> **Objetivo:** eliminar rutas hardcodeadas, centralizar definición y garantizar navegación tipada y consistente.
> Este documento gobierna **cómo se definen y cómo se usan las rutas** en el proyecto.

---

## ÍNDICE CANÓNICO (usar estos IDs)

1. Principio base de routing
2. Definición y estructura (feature + shared + agregador)
3. Rutas dinámicas y consistencia `path` ↔ `generatePath`
4. Consumo de rutas (UI, actions, navegación)
5. Metadata
6. Tipado y seguridad (enforcement)
7. Tests y anti‑patrones

---

## 1. Principio base de routing

- **Prohibido** usar rutas hardcodeadas en UI, lógica, tests o mocks.
- El código **consume rutas**, no construye URLs.

> Si ves `"/algo"` escrito a mano fuera del sistema de rutas, es una violación.

---

## 2. Definición y estructura (feature + shared + agregador)

### 2.1. Estructura oficial

- Existe un archivo principal de rutas en `features/routes.ts`.
- Tipos compartidos de rutas viven en `features/shared/types/routes.ts`.
- Utilidades compartidas (solo si son necesarias) viven en `features/shared/utils/routes.ts`.

### 2.2. Definición por feature

- Cada feature define sus rutas en un objeto único: `<feature>Routes`.
- Las rutas se identifican por **claves semánticas** (`home`, `list`, `edit`, `detail`, etc.).
- Cada ruta define como mínimo:
  - `path`
  - `title`
  - `description`

### 2.3. Agregador global (`appRoutes`)

- El agregador global **importa** las rutas de cada feature y las expone por namespace.
- El agregador global **puede** declarar rutas globales (ej. `home`) **solo** si no pertenecen a ninguna feature.
- **Prohibido** declarar rutas específicas de una feature en el agregador global.
- **Prohibido** aplanar rutas de features a nivel root.

---

## 3. Rutas dinámicas y consistencia `path` ↔ `generatePath`

### 3.1. Patrón de parámetros

- `path` usa siempre `:param` (ej. `/clubs/:id/edit`).
- `path` **siempre** empieza con `/`.
- `path` **no** termina con `/`.

### 3.2. Reglas para rutas dinámicas

- Toda ruta con parámetros **debe**:
  - declarar explícitamente sus parámetros
  - exponer `generatePath(params)`

### 3.3. Consistencia obligatoria

- Si `path` contiene `:param`, entonces `generatePath` **debe** reemplazar exactamente ese `:param`.
- `generatePath` **prohibido** inventar segmentos que no existan en `path`.
- `generatePath` debe devolver una URL sin `:` ni valores `undefined`.

### 3.4. Prohibición de interpolación manual

- **Prohibido** interpolar parámetros manualmente:
  - ❌ `"/club/" + slug`
  - ❌ `` `/club/${slug}` ``

---

## 4. Consumo de rutas (UI, actions, navegación)

- Navegación (`push`, `replace`, `Link`, redirects) **siempre** usa el sistema de rutas.
- **Prohibido** duplicar paths en tests, mocks, seeds o documentación técnica.
- Si necesitas construir URLs con querystring/hash, se hace **fuera** del sistema de rutas (pathname primero).

---

## 5. Metadata

- Las rutas son la **fuente de verdad** para:
  - `title`
  - `description`
  - iconos (si aplica)

- Componentes y páginas **no** definen metadata manualmente si ya existe en rutas.

- La obtención de metadata debe hacerse a través de una utilidad compartida (si existe).

---

## 6. Tipado y seguridad (enforcement)

### 6.1. `satisfies` obligatorio

- Rutas estáticas: **MUST** usar `satisfies BaseRoute`.
- Rutas dinámicas: **MUST** usar `satisfies DynamicRoute<...>`.
- **PROHIBIDO** usar casts tipo `as BaseRoute` / `as DynamicRoute`.

### 6.2. `as const` obligatorio

- Todo objeto `<feature>Routes` termina con `as const`.

### 6.3. Seguridad de tipos

- Parámetros tipados (sin `any`).
- La generación de rutas inválidas debe fallar en compilación.

---

## 7. Tests y anti‑patrones

### 7.1. Test único de contrato

- Existe **un solo** test de contrato para rutas: `/tests/features/routes.test.ts`.
- Debe validar como mínimo:
  - cada ruta tiene `path/title/description`
  - rutas dinámicas tienen `generatePath`
  - `generatePath` no devuelve `:` ni `undefined`

### 7.2. Anti‑patrones (violaciones)

- Rutas hardcodeadas en UI o lógica
- Interpolación manual de parámetros
- Duplicar paths en distintos sitios
- Definir metadata fuera del sistema de rutas
- Crear rutas sin clave semántica
- Usar casts (`as BaseRoute`) en lugar de `satisfies`
- Crear carpetas no declaradas por estructura (ej. `features/shared/lib/**`)
- Crear `README.md`, `examples/` o archivos de ejemplo para routing
- Crear múltiples tests de routing (debe existir solo el test de contrato)

---

## REGLA FINAL

> Las rutas son **contratos**, no strings.
> Si no pasan por el sistema de rutas, no existen.
