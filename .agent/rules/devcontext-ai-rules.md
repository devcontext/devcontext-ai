---
trigger: always_on
---

# GOLDEN RULE – AI Context Control Plane (Solo Dev MVP)

You are an engineering agent working inside a Next.js project that implements **AI Context Control Plane**.
Your job is to build the MVP exactly as specified in the docs, with a strong bias toward **simplicity**, **determinism**, and **predictable behavior**.

---

## 0) Source of truth (MANDATORY)

Before making changes, you MUST read and follow these files:

* `docs/PRODUCT_VISION.md`
* `docs/MVP.md`
* `docs/DECISIONS.md`
* `docs/ARCHITECTURE.md`
* `docs/core/CORE_CONCEPTS.md`
* `docs/core/RESOLVER_SPEC.md`
* `docs/core/RULESET_CATALOG.md`
* `docs/core/COMMANDS.md`
* `docs/ROADMAP.md`

If your planned change conflicts with any decision in `docs/DECISIONS.md`, STOP and explain the conflict.

---

## 1) MVP focus (NON-NEGOTIABLE)

This is a **Solo Dev MVP**.

DO NOT introduce:

* Teams, roles, permissions
* Custom rules or custom commands
* Prompt editing
* AI inside the Resolver
* Dynamic intent inference
* Plugins, marketplace, analytics
* Over-engineering or abstractions “for later”

If a requested feature is out-of-scope, say so and propose the smallest compliant alternative.

---

## 2) Core product definition (DO NOT DRIFT)

This product is **NOT** a prompt manager.

It is a **behavior governance system** that compiles:

```
project + command + rule toggles
→ ResolvedContract
```

Success means:

* the user stops writing prompts
* AI behavior becomes predictable
* contracts are deterministic and explicit

---

## 3) Architecture constraints (CRITICAL)

* Next.js App Router
* Route Handlers for APIs (including MCP)
* Monolith, modular (NO microservices)
* Resolver is framework-agnostic core logic

### MCP rules

* MCP is an adapter, NOT the core
* MCP does NOT execute LLMs in the MVP
* MCP only returns `ResolvedContract`
* Auth via API key (hashed, scoped)

---

## 4) Core structure (MANDATORY – NO EXCEPTIONS)

The `features/core` folder is **strictly layered**.

### 4.1 Domain layer (PURE – NO I/O)

```
features/core/domain/
  ├── resolver/
  ├── catalogs/
  ├── contracts/
  └── types/
```

Rules:

* ❌ NO Supabase
* ❌ NO Next.js imports
* ❌ NO network, filesystem, env access
* ✅ Pure functions only
* ✅ Deterministic logic only

The Resolver **MUST live here**.

---

### 4.2 Infra layer (I/O ADAPTERS ONLY)

```
features/core/infra/
  └── db/
      ├── supabase-client.ts
      ├── projects-repo.ts
      ├── toggles-repo.ts
      └── resolve-logs-repo.ts
```

Rules:

* Supabase lives **ONLY here**
* Infra NEVER contains business logic
* Infra NEVER decides rules or intents
* Infra is replaceable

---

### 4.3 App layer (USE-CASES / ORCHESTRATION)

```
features/core/app/
  ├── resolve-preview.ts
  └── mcp-execute.ts
```

Rules:

* Orchestrates domain + infra
* No business logic duplication
* No UI code
* No Resolver logic here

---

### 4.4 UI & API placement

* UI → `app/*`
* APIs → `app/api/*`
* APIs call `features/core/app/*`
* APIs NEVER contain Resolver logic

---

## 5) Resolver invariants (ABSOLUTE)

The Resolver MUST be:

* deterministic
* stateless
* pure
* synchronous logic

Same input ⇒ **byte-equal** contract text.

Conflict resolution rules:

* error vs error → BLOCK
* warn vs error → keep error
* info conflicts → drop info

Inputs/outputs MUST match `docs/core/RESOLVER_SPEC.md`.

---

## 6) Catalog invariants

Catalogs are **system-owned** and live as code/config:

* rules
* rulesets
* commands
* stack presets

Rules:

* Stable IDs only (`ruleId`, `commandId`, etc.)
* NOT stored in DB in MVP
* Resolver reads catalogs, never mutates them

---

## 7) Data & storage (MVP – Supabase)

Supabase is used for persistence but MUST be isolated.

Persist ONLY:

* Account (API key hash)
* Project
* Rule toggles (enabled/disabled)
* Resolve logs (minimal, structured)

Rules:

* ❌ Do NOT store raw API keys
* ❌ Do NOT store full user input (truncate if needed)
* ❌ Resolver MUST NOT depend on DB shape

---

## 8) UX constraints (MVP)

* Commands are primary interaction
* UI hides internal concepts (intent, resolver)
* Contract Preview is always visible
* No prompt editing
* Defaults must work without configuration

---

## 9) Work process (REQUIRED)

For every task:

1. Explain the plan (brief)
2. List affected files
3. Implement minimal working code
4. Add basic error handling
5. Keep changes small (≤5 files when possible)

NEVER:

* add dependencies without approval
* add abstractions “just in case”
* optimize prematurely

If a dependency seems unavoidable, STOP and justify.

---

## 10) Response format (MANDATORY)

Every response MUST include:

* Short plan
* File-by-file changes
* Complete code blocks (no TODOs)
* How to verify

If something is ambiguous:

* Ask ONE concise question
  OR
* State the safest assumption and proceed

---

## FINAL RULE

If your change makes:

* the Resolver depend on Supabase, UI, or Next.js
* rules configurable by users
* behavior less predictable

👉 **STOP. It violates the product core.**

END.