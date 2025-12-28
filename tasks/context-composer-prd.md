# PRD — Context Composer (MVP)

## 1. Introduction / Overview
The **Context Composer** is the core entry point of the AI Context Control Plane. It allows developers to create, refine, and version explicit context for AI models.

Instead of writing prompts repeatedly, users *compose context* from real sources (docs, notes, text) and store it as **versioned, auditable artifacts**.

The Context Composer is focused exclusively on **context creation and trust**, not execution, commands, or governance enforcement.

---

## 2. Goals
- Eliminate repetitive prompt writing.
- Provide a clear, guided flow for context creation.
- Ensure all context is versioned and auditable.
- Produce context that can later be consumed reliably by AI tools.

---

## 3. User Stories
- As a developer, I want to upload multiple sources so I can consolidate knowledge into a single context.
- As a developer, I want the system to optionally help me generate a structured context draft.
- As a developer, I want to skip AI entirely and use raw sources as reference.
- As a developer, I want to edit everything before saving.
- As a developer, I want to see how my context evolved over time.

---

## 4. Functional Requirements

### 4.1 Wizard — Step 1: Add Sources
1. Allow uploading multiple files (`.md`, `.txt`, `.pdf`).
2. Allow pasting raw text.
3. Show a summary of added sources before continuing.

---

### 4.2 Wizard — Step 2: Select Mode
User must select one mode:
- **Reference Only** — sources are stored and exposed as-is.
- **Guided Draft** — AI generates a structured context draft.
- **Both** — store raw sources + generate draft.

---

### 4.3 Wizard — Step 3: Guided Generation (Conditional)
1. If **Reference Only**, this step is skipped entirely.
2. If AI-enabled, generate a **structured context draft** from sources.
3. The structure is **guidance only** (e.g. Overview, Architecture Notes, Rules, Constraints).
4. Output is always editable and never auto-saved.

---

### 4.4 Wizard — Step 4: Editor & Save
1. Provide a markdown editor.
2. Require a unique **Context Name**.
3. Every save creates a new immutable `ContextVersion`.
4. Allow optional **free-text tags** at save time.

---

## 5. Non-Goals (Explicit)
- Command execution
- Prompt editing
- Rule enforcement
- Governance logic
- Team collaboration

---

## 6. Design Considerations
- Dark, distraction-free UI
- Clear wizard progression
- Editor-first experience

---

## 7. Technical Considerations
- Supabase tables: `Source`, `Context`, `ContextVersion`
- AI logic only in App layer
- No coupling with Resolver logic

---

## 8. Success Metrics
- Reference-only flows never trigger AI
- All saves create a version
- Context feels reusable without rewriting prompts

---

## 9. Decisions (Locked for MVP)
- Versions are immutable
- Max source size: 5MB
