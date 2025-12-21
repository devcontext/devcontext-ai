# RULESET_CATALOG.md

Este documento define el **catálogo de reglas del MVP**.

Las reglas aquí descritas representan **el conocimiento que el usuario no quiere ni debe pensar**.

Si una regla no es:

* clara
* ejecutable
* defendible

entonces **no entra en el MVP**.

---

## 1. Principios del Catálogo

* Las reglas son **opinadas por defecto**
* Las reglas deben ser **enforzables por contrato**, no por fe
* Las reglas existen para **prevenir comportamientos dañinos**, no para optimizar
* El catálogo es **cerrado** en el MVP

---

## 2. Severities

* **error** → No negociable. Si se viola, la ejecución debe detenerse.
* **warn** → Se permite, pero debe ser explícito.
* **info** → Contexto adicional, nunca bloquea.

En el MVP, **priorizamos `error`**.

---

## 3. Intent Coverage

Las reglas solo se aplican si coinciden con el intent:

* `generate`
* `refactor`
* `review`

Una regla que no aplica al intent **no se incluye** en el contrato.

---

## 4. Rule Catalog (MVP)

### R‑001 — No New Dependencies

* **id:** `no-new-dependencies`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Prevent dependency sprawl and unwanted installs.

**Directive**

> Do NOT install new dependencies or packages.

**Conflicts**
None

**Contributes Constraints**

```json
{ "allowNewDependencies": false }
```

---

### R‑002 — Prefer Server Components

* **id:** `prefer-server-components`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Enforce modern Next.js architecture decisions.

**Directive**

> Prefer Server Components by default. Use Client Components only if strictly required.

**Conflicts**

* `force-client-components`

**Contributes Constraints**

```json
{ "preferServerComponents": true }
```

---

### R‑003 — Limit Files Changed

* **id:** `limit-files-changed`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Avoid large, risky changes for simple tasks.

**Directive**

> Limit the solution to a maximum number of files.

**Contributes Constraints**

```json
{ "maxFilesChanged": 5 }
```

---

### R‑004 — Use Existing UI Components

* **id:** `use-existing-ui-components`
* **severity:** `warn`
* **appliesToIntents:** `generate`

**Purpose**
Encourage reuse over reinvention.

**Directive**

> Prefer existing UI components and patterns before creating new ones.

**Conflicts**
None

---

### R‑005 — Avoid Over‑Engineering

* **id:** `avoid-over-engineering`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Prevent unnecessary abstractions and complex patterns.

**Directive**

> Do not introduce complex architectural patterns unless explicitly required.

**Conflicts**
None

---

### R‑006 — No Architecture Shifts

* **id:** `no-architecture-shifts`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Protect existing architectural decisions.

**Directive**

> Do not change architectural patterns or project structure.

**Conflicts**
None

---

### R‑007 — Ask Before Guessing

* **id:** `ask-before-guessing`
* **severity:** `error`
* **appliesToIntents:** `generate`, `refactor`, `review`

**Purpose**
Avoid silent assumptions.

**Directive**

> If required information is missing, STOP and ask instead of guessing.

**Conflicts**
None

---

### R‑008 — Keep Changes Readable

* **id:** `keep-changes-readable`
* **severity:** `info`
* **appliesToIntents:** `generate`, `refactor`

**Purpose**
Improve maintainability and reviewability.

**Directive**

> Keep changes small, clear and easy to review.

**Conflicts**
None

---

## 5. Default Ruleset (MVP)

**Ruleset: `default-solo-dev`**

Enabled by default:

* R‑001 no-new-dependencies
* R‑002 prefer-server-components
* R‑003 limit-files-changed
* R‑005 avoid-over-engineering
* R‑006 no-architecture-shifts
* R‑007 ask-before-guessing

Optional (toggleable):

* R‑004 use-existing-ui-components
* R‑008 keep-changes-readable

---

## 6. Ruleset Design Notes

* The default ruleset must work **without any configuration**
* Toggles only disable rules; they never add new behavior
* Rules must never contradict silently

---

## 7. Future Extensions (Not MVP)

* Stack-specific rulesets
* Severity customization
* Custom user rules

These are explicitly out-of-scope for the MVP.

---

## 8. Guiding Rule

> Fewer rules with clear impact are better than many vague rules.
