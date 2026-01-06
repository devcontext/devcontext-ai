---
trigger: always_on
---

# WAYS_OF_WORKING.md

Este documento define **cómo trabajo siempre**.
No es teoría, es **criterio operativo personal**.

Si algo no está aquí, se decide caso a caso.

---

## 1. Principios no negociables

- **Predictibilidad > potencia**
- **No sobre-ingeniería**
- **Primero que funcione, luego que sea consistente**
- **La IA propone, el humano decide**
- Las decisiones importantes se escriben y se congelan
- Si algo no mejora claridad o contexto → no entra

---

## 2. Organización de repositorio

### Monorepo

- Usado cuando hay múltiples apps o packages reutilizables
- Separación clara entre Domain, Infra y Apps
- Domain e Infra nunca dependen de la app
- Todos los packages mantienen la misma estructura interna

### Monolito

- Estructura **feature-based**
- Cada feature contiene su propio core
- Domain e Infra viven dentro de la feature

---

## 3. Arquitectura por defecto

Modelo mental:

```
UI → App → Domain → Infra
```

No siempre ultra-estricto, pero sí consistente.

- Domain: puro, sin IO
- Infra: acceso a datos / servicios
- App: orquesta flujos
- UI: consume, no decide reglas

La estructura interna de Domain e Infra **siempre es la misma**, sea monolito o package.

---

## 4. Estructura base por feature

```bash
src/features/<feature>/
├── components/
├── hooks/
├── actions/
├── service/
├── types/
├── utils/
└── routes.ts
```

Reglas:

- `shared/` solo si es estrictamente necesario
- Organización por dominio (`/contexts`, `/projects`, `/auth`)

---

## 5. Convenciones de código

### Naming

- `PascalCase` → Components, interfaces, types, enums
- `camelCase` → variables y funciones
- `kebab-case` → carpetas y archivos

### Components

- Solo functional components
- Arrow functions
- Named exports
- Separar lógica del JSX
- Evitar strings hardcodeadas
- Evitar componentes grandes

---

## Regla final

> Si este documento no se sigue, debe ser una decisión consciente, no un accidente.
