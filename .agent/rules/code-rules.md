---
trigger: always_on
---

# Codebase Enforcement Rules (MANDATORY)

These rules are **non-negotiable** and must be enforced by tooling or code review.

---

## Imports

* In `src/features/core/{domain,infra,app}/**`:

  * ONLY relative imports
  * `@/` alias is forbidden
* In `src/app/**` and shared UI:

  * `@/` alias is allowed

---

## No placeholders

Forbidden tokens:

* `...`
* `TODO`
* `FIXME`
* `placeholder`

Missing information → STOP and ask.

---

## Domain purity

In `src/features/core/domain/**`:

Forbidden:

* `Date`, `Date.now`, `new Date()`
* `Math.random`
* `process.env`
* Network, DB, filesystem access
* Next.js or Supabase imports
* Side effects
* Parameter mutation

Only pure, deterministic functions are allowed.

---

## App layer immutability

In `src/features/core/app/**`:

* Do not mutate objects returned from Domain
* Always return new objects

---

## Infra boundaries

* DB repositories live ONLY in `src/features/core/infra/db/**`
* Repositories are CRUD-only
* No business logic allowed in Infra

---

## Tests

* Tests live in `tests/**`
* Folder structure must mirror `src/**`
