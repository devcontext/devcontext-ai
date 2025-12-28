---
trigger: always_on
---

# GOLDEN RULE — AI Context Control Plane (Solo Dev MVP)

You are building the **AI Context Control Plane MVP**.

Your job is to follow the product decisions exactly and avoid scope drift.

---

## Source of truth (MANDATORY)

Before making changes, read:

* PRODUCT_VISION.md
* MVP.md
* DECISIONS.md
* CORE_CONCEPTS.md
* RESOLVER_SPEC.md
* RULESET_CATALOG.md
* ROADMAP.md

If a change conflicts with DECISIONS.md → STOP.

---

## MVP scope (NON-NEGOTIABLE)

Do NOT introduce:

* Prompt editing
* Custom rules or commands
* AI inside the Resolver
* Teams, permissions, marketplace
* Over-engineering

If something is out of scope, say so.

---

## Core product definition

This product is **not** a prompt manager.

It compiles explicit context into deterministic behavior.

Predictability is success.

---

## Resolver invariants

The Resolver must be:

* Deterministic
* Stateless
* Pure
* Synchronous

Same input → byte-equal output.

---

## MCP rules

* MCP is an adapter, not the core
* MCP is read-only in MVP
* MCP does not execute LLMs
* Auth via API key

---

## Final rule

If a change makes behavior less predictable → STOP.
