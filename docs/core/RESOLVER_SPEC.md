# RESOLVER_SPEC.md

Este documento define el **Resolver** como contrato técnico (sin implementación).

Objetivo: que el Resolver sea **determinista, aburrido y fiable**.

---

## 0. Confirmación de entendimiento (baseline)

Sí, lo estás siguiendo bien:

* El sistema existe para definir **cómo debe comportarse la IA** dentro de un proyecto.
* El usuario (Solo Dev) solo:

  * crea un proyecto
  * elige un stack preset
  * activa/desactiva toggles de reglas (de un catálogo predefinido)
  * ejecuta comandos
* El sistema:

  * interpreta `command` → asigna `intent`
  * compila reglas + constraints aplicables
  * genera un **ResolvedContract**

---

## 1. Scope del Resolver (MVP)

### El Resolver SÍ hace

* Command → Intent (mapping fijo)
* Selección de reglas aplicables por intent
* Compilación de constraints
* Resolución de conflictos (determinista)
* Render de contrato final (plantilla)

### El Resolver NO hace

* No usa IA
* No analiza repositorios
* No valida output del modelo
* No hace planning
* No ejecuta herramientas

---

## 2. Entradas (Inputs)

### 2.1 Input principal: `ResolveRequest`

```ts
type ResolveRequest = {
  projectId: string;
  commandId: string; // e.g. "create-component"
  userInput: string; // e.g. "Button with variants"
  target?: {
    // Optional hints. MVP should not depend on these.
    pathHint?: string; // e.g. "src/components"
    files?: string[];  // e.g. ["src/components/button.tsx"]
  };
  contextHints?: {
    // Optional. MVP may ignore.
    currentBranch?: string;
    tool?: "cursor" | "chatgpt" | "gemini" | "unknown";
  };
};
```

### 2.2 Datos cargados por el Resolver

* Project
* StackPreset (del project)
* ActiveRuleset + toggles
* Command definition (system-owned)
* Rule catalog entries

---

## 3. Salidas (Outputs)

### 3.1 Output principal: `ResolveResult`

```ts
type ResolveResult =
  | {
      status: "ok";
      contract: ResolvedContract;
    }
  | {
      status: "blocked";
      blocked: BlockedResolution;
    };
```

### 3.2 `ResolvedContract`

```ts
type ResolvedContract = {
  id: string;
  projectId: string;
  commandId: string;
  intentId: IntentId;

  // Human-readable contract text sent to the AI
  contractText: string;

  // Metadata for logging/debug/auditing
  meta: {
    stackPresetId: string;
    rulesApplied: Array<{ id: string; severity: "error" | "warn" | "info" }>;
    constraintsApplied: Record<string, unknown>;
    stopConditions: string[];
    generatedAt: string; // ISO
  };
};
```

### 3.3 `BlockedResolution`

```ts
type BlockedResolution = {
  reason:
    | "unknown_command"
    | "missing_project"
    | "conflicting_rules"
    | "invalid_configuration";

  message: string; // Human readable

  details?: {
    conflicts?: Array<{ a: string; b: string; why: string }>;
  };
};
```

---

## 4. Conceptos internos necesarios (mínimos)

### 4.1 Intent

```ts
type IntentId = "generate" | "refactor" | "review";
```

### 4.2 Command

```ts
type CommandDefinition = {
  id: string; // create-component
  displayName: string;
  intentId: IntentId;
  templateId: string; // contract template selector
};
```

### 4.3 Rule

```ts
type RuleDefinition = {
  id: string;
  title: string;
  description: string;
  severity: "error" | "warn" | "info";
  appliesToIntents: IntentId[];

  // Contract fragments
  directive: string; // e.g. "Do NOT install new dependencies."

  // Optional conflict map (MVP: small static list)
  conflictsWith?: string[];

  // Optional constraint contributions
  contributesConstraints?: Record<string, unknown>;
};
```

---

## 5. Algoritmo del Resolver (Paso a paso)

### Step 1 — Load Project

* Load project by `projectId`
* If missing → `blocked: missing_project`

### Step 2 — Load Command

* Load command by `commandId`
* If missing → `blocked: unknown_command`

### Step 3 — Resolve Intent

* `intentId = command.intentId`
* (No inference. No heuristics.)

### Step 4 — Load Stack Preset

* Load stack preset from project
* If missing/invalid → `blocked: invalid_configuration`

### Step 5 — Build Active Rule Set

* Start from ruleset base
* Apply user toggles (enabled/disabled)
* Filter by `appliesToIntents.includes(intentId)`

Result: `activeRules[]`

### Step 6 — Conflict Resolution (Deterministic)

#### 6.1 Conflict rules

* If any `error` rule conflicts with another `error` rule → `blocked: conflicting_rules`
* If `warn` conflicts with `error` → keep `error`, drop `warn`
* If `info` conflicts with anything → drop `info`

#### 6.2 Conflict detection

* A rule conflicts if `ruleA.conflictsWith` contains `ruleB.id`

Output:

* `resolvedRules[]`
* or blocked with conflict details

### Step 7 — Compile Constraints

* Start with stack preset constraints (if any)
* Merge constraints contributed by each active rule
* Apply project-level constraint overrides (MVP: optional)

MVP constraint keys suggested:

* `maxFilesChanged`
* `allowNewDependencies`
* `preferServerComponents`

### Step 8 — Render Contract

#### 8.1 Contract sections (fixed order)

1. Execution summary (human)
2. Non-negotiable rules (bullets)
3. Constraints (bullets)
4. Project stack summary
5. Stop conditions
6. Output requirements

#### 8.2 Output requirements (MVP defaults)

* Keep changes small and readable
* If uncertain, ask before assuming
* Do not invent project conventions beyond provided rules

### Step 9 — Return `ResolveResult.ok`

* Create `ResolvedContract` with metadata

---

## 6. Contract Template (MVP v1)

> El template debe ser **estable**. No "prompt engineering" creativo.

```text
You are executing: {INTENT_HUMAN}

NON‑NEGOTIABLE RULES:
{RULES_BULLETS}

CONSTRAINTS:
{CONSTRAINTS_BULLETS}

PROJECT STACK:
{STACK_BULLETS}

STOP CONDITIONS:
- If any rule must be violated, STOP and ask for explicit permission.
- If required information is missing, ask instead of guessing.

OUTPUT REQUIREMENTS:
- Keep the solution simple and aligned with the stack.
- Provide a short file-level plan before code when generating changes.
```

---

## 7. Error Handling & Logging (MVP)

### 7.1 Logging (must-have)

For each `ResolveRequest`:

* projectId
* commandId
* intentId
* rulesApplied (ids)
* constraintsApplied
* status (ok/blocked)
* blocked reason if any

### 7.2 No PII

Do not store:

* raw userInput (optional: store hashed or truncated)
* api keys

---

## 8. Test Cases (Acceptance)

### 8.1 Determinism

* Same request twice → same `contractText` (byte-equal)

### 8.2 Filtering

* A rule not applicable to intent must not appear in contract

### 8.3 Conflicts

* Two conflicting error rules → `blocked`

### 8.4 Defaults

* No toggles provided → ruleset defaults applied

---

## 9. Non-goals (MVP)

* Dynamic intent inference
* Repo scanning
* Diff validation
* Policy engines
* Plugin architecture

---

## 10. Guiding Rule

> If the Resolver becomes "smart", it becomes unreliable.
> The Resolver must remain a compiler, not a brain.
