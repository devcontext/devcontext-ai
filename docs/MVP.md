# MVP.md

## MVP Goal

Validate that **solo developers can control AI behavior without writing prompts**, by executing commands that always generate a predictable, rule‑bound AI contract.

If the MVP works, the developer should *trust* the AI again.

---

## 1. Target User (Strict)

* Solo developer
* Uses Cursor / ChatGPT / Gemini daily
* Works on real projects (not demos)
* Already frustrated with AI over‑generation

**No teams. No collaboration. No enterprise needs.**

---

## 2. Core Use Case (The Only One That Matters)

> “I want to ask the AI to do something in my project, and I want it to respect my rules without me explaining them again.”

Everything in the MVP must support this.

---

## 3. MVP Scope (In‑Scope)

### 3.1 Project Setup

* Create a project
* Select **one stack preset**
* Automatically assign a default ruleset

Constraints:

* One active ruleset per project
* No custom rule creation

---

### 3.2 Stack Presets (Fixed List)

Initial presets:

* Next.js 16  (App Router)
* Vite + React (SPA)
* Node.js (TypeScript)

Each preset defines:

* Language
* Framework assumptions
* Default ruleset

---

### 3.3 Rules (System‑Owned)

Rules are **predefined and opinionated**.

MVP rules (initial set):

* No new dependencies
* Prefer server components
* Limit number of files changed
* Prefer existing UI/components
* Avoid over‑engineering

User capabilities:

* Enable / disable rules (toggles)
* Read a short human explanation

User **cannot**:

* Create rules
* Edit rule logic

---

### 3.4 Commands (Primary Interaction)

Commands are how the user works with the system.

MVP commands:

* `/create-component`
* `/refactor-file`
* `/review-changes`

Each command:

* Maps to a single intent
* Has a fixed behavior
* Produces a contract preview

No free‑form prompting.

---

### 3.5 Resolver (Core Engine)

The Resolver:

* Receives: project + command + user input
* Resolves applicable rules
* Generates a **ResolvedContract**

Guarantees:

* Deterministic output
* No AI involved
* Same input → same contract

---

### 3.6 Contract Preview

Before execution, the user can see:

* Intent (human readable)
* Active rules (non‑negotiable)
* Constraints
* Project stack summary

User actions:

* Copy contract
* Execute command via MCP

---

### 3.7 MCP Integration (Minimal)

* API key per user
* API key scoped to projects
* One execution endpoint

The MCP:

* Receives the resolved contract
* Forwards it to the AI tool

---

## 4. Explicit Out‑of‑Scope (MVP)

The MVP will **not** include:

* Team or multi‑user support
* Rule creation or editing
* Rule versioning
* AI output validation
* Prompt editing
* History or analytics
* Marketplace or extensions
* Pricing / billing

If it’s not listed in **In‑Scope**, it’s out.

---

## 5. UX Constraints (Non‑Negotiable)

* The user must never see raw prompts
* Internal concepts (intent, resolver) must not be exposed
* Default setup must work without configuration
* UI must feel opinionated, not generic

---

## 6. Definition of Done (MVP)

The MVP is considered complete when:

* A solo dev can create a project in < 1 minute
* They can execute all MVP commands
* The AI output consistently respects the rules
* The user stops rewriting prompts manually

---

## 7. MVP Validation Criteria

The MVP is **validated** if:

* The creator (you) uses it daily
* It replaces manual prompting
* It reduces frustration, not increases it

No vanity metrics required.

---

## 8. Kill Criteria (Important)

The MVP should be reconsidered if:

* The Resolver becomes complex or fragile
* Users ask mainly for rule customization
* The UI drifts toward configuration over action

If any of these happen, stop and reassess.

---

## 9. Guiding Rule

> If a feature does not directly improve AI predictability,
> it does not belong in the MVP.
