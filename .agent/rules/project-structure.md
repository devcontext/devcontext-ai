---
trigger: always_on
---

---

## trigger: always_on

# 🧱 PROJECT STRUCTURE RULESET

> **Objetivo:** definir una estructura de proyecto predecible, escalable y fácil de auditar por humanos y agentes.
> Este documento gobierna **dónde vive cada cosa y cómo se relacionan los módulos**.

---

## ÍNDICE CANÓNICO (usar estos IDs)

1. Naming conventions
2. Estructura base del proyecto
3. `features/shared`
4. Estructura de una feature
5. Imports y aliases
6. Domain en proyectos single‑core
7. Tests
8. Anti‑patrones estructurales

---

## 1. Naming conventions

- Variables y funciones: `camelCase`
- Clases y componentes React: `PascalCase`
- Directorios y archivos: `kebab-case`
- Constantes globales: `UPPER_SNAKE_CASE`

---

## 2. Estructura base del proyecto

```text
src/
  app/
  features/
    <feature-name>/
      components/
      hooks/
      actions/
      types/
      utils/
      routes.ts
  styles/
  types/      # solo tipos globales
  config/     # configuración (si existe)

tests/
```

### Reglas

- Todo el código vive dentro de `src/`.
- `app/` **no contiene lógica de negocio**; solo composición y routing.
- `types/` solo contiene tipos transversales reales.

---

## 3. `features/shared`

Contiene **infraestructura reutilizable**, no lógica de producto.

```text
features/shared/
  ui/
  components/
  hooks/
  types/
```

### Reglas

- Si algo lo usa una sola feature, **no va a shared**.
- `ui` no contiene reglas de negocio.
- `types` debe ser pequeño y con ownership claro.

---

## 4. Estructura de una feature

```text
features/<feature>/
  components/
  hooks/
  actions/
  types/
  utils/
  routes.ts
```

### Reglas

- Cada feature es autocontenida.
- Prohibido importar internals de otra feature.
- La comunicación entre features se hace vía API pública.

---

## 5. Imports y aliases

### Alias

- Se usa **un único alias**: `@/*` → `src/*`

### Reglas

- Prohibido usar imports relativos largos (`../../..`).
- Imports cross‑feature **siempre** usan `@/`.
- Una feature no importa internals de otra feature.

---

## 6. Domain en proyectos single‑core

```text
features/core/
  app/
  domain/
    constants/
    errors/
    models/
    repositories/
    services/
    value-objects/
  infra/
    db/
    mappers/
    repositories/
```

### Reglas

- `domain` no depende de UI ni infra.
- `infra` implementa contratos del domain.
- `app` orquesta casos de uso.

---

## 7. Tests

- Todos los tests viven en `/tests`.
- Prohibido mezclar tests dentro de `src/`.

---

## 8. Anti‑patrones estructurales

- Carpetas `utils` globales sin propósito
- `types.ts` gigantes sin ownership
- Imports cross‑feature profundos
- Lógica de negocio en `app/`

---

## REGLA FINAL

> Si la estructura no reduce decisiones, no es arquitectura.
