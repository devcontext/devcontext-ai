# ROADMAP.md

Este roadmap está diseñado para **avanzar sin re‑trabajo** y **sin diluir el core del producto**.

La prioridad no es velocidad, sino **dirección correcta**.

---

## 1. NOW — MVP (Validación del Core)

> Objetivo: validar que un solo developer puede **controlar el comportamiento de la IA** sin escribir prompts.

### Scope

* Project (1 usuario, n proyectos)
* Stack presets fijos
* Ruleset único por proyecto
* Catálogo de reglas cerrado
* Toggles simples de reglas
* Commands MVP:

  * `/create-component`
  * `/refactor-file`
  * `/review-changes`
* Resolver determinista (sin IA)
* Contract Preview
* MCP básico (API key por cuenta)

### UX

* Interfaz simple y guiada
* Comandos como acción principal
* Reglas como medio, no como protagonista
* Preview del contrato siempre visible

### Done means

* El creador (tú) lo usa a diario
* No escribes prompts manuales
* La IA deja de instalar cosas raras
* Los cambios son pequeños y coherentes

---

## 2. NEXT — Post‑MVP Inmediato (Pulido + Señales de Valor)

> Objetivo: mejorar confianza, no añadir poder.

### Mejoras permitidas

* Más stack presets (React Native, Expo, etc.)
* Más rulesets oficiales ("Strict", "Balanced")
* Mejor Contract Preview (diff visual, highlights)
* Logs básicos por ejecución
* Mensajes de bloqueo más claros

### NO permitido aún

* Custom rules
* Custom commands
* Teams
* Plugins

---

## 3. LATER — Expansión Controlada

> Objetivo: escalar sin romper el modelo mental.

### Posibles líneas de evolución

* Team mode (shared projects)
* Role‑based governance (owner vs contributors)
* Ruleset versioning
* Read‑only custom rules (advanced users)
* CI / PR integrations
* CLI / VS Code extension

Todo esto **solo** si el MVP demuestra valor real.

---

## 4. Scalability Guardrails (Decisiones Tempranas)

Estas decisiones se asumen **desde el MVP**, aunque no se implementen aún.

### 4.1 Identidad y Scope

* Todo está scoping por `accountId` + `projectId`
* IDs estables y semánticos:

  * `ruleId`
  * `rulesetId`
  * `commandId`
  * `intentId`

---

### 4.2 Resolver como Pure Function

* Input: `ResolveRequest`
* Output: `ResolveResult`
* Sin estado
* Sin IA

Esto permite:

* testear
* versionar
* mover a edge / server sin refactor

---

### 4.3 Versionado desde el Día 1

* `resolverVersion: v1`
* `contractVersion: v1`

No implementar versionado complejo.
Solo **reservar el espacio**.

---

### 4.4 Reglas como Datos, no Código

* Las reglas viven como definiciones
* El Resolver solo las interpreta

Esto permite:

* añadir reglas sin reescribir lógica
* evitar branching explosivo

---

### 4.5 MCP como Adaptador

* MCP no es el core
* Puede cambiar por API / CLI / Extension
* Resolver permanece intacto

---

## 5. Presión de los Developers (Plan de Respuesta)

Cuando (no si) los developers pidan:

> "Quiero reglas custom"

La respuesta será:

* ❌ No en el MVP
* ✅ Nuevos rulesets oficiales
* ✅ Toggles más finos
* ✅ Better defaults

Custom rules solo se consideran cuando:

* el core está validado
* el modelo mental no se rompe

---

## 6. Regla Final

> Si una decisión futura pone en riesgo la predictibilidad del sistema,
> esa decisión se pospone.

Predictibilidad > Flexibilidad.
