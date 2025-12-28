# Context Composer — Task List

## Prerequisites

> ⚠️ **This task assumes `tech-persistence-setup.md` is complete.**
> Domain types, database schema, and repositories must already exist.

---

## Relevant Files

### App Layer (Use Cases)
- `src/features/core/app/composer/create-context-draft.ts` - AI draft generation
- `src/features/core/app/composer/save-context-version.ts` - Save context orchestration

### Composer Feature (UI)
- `src/features/composer/components/wizard-layout.tsx`
- `src/features/composer/components/step-add-sources.tsx`
- `src/features/composer/components/step-select-mode.tsx`
- `src/features/composer/components/step-guided-generation.tsx`
- `src/features/composer/components/step-editor-save.tsx`
- `src/features/composer/hooks/use-wizard-state.ts`
- `src/features/composer/types/index.ts`

### App Routes
- `src/app/composer/page.tsx`
- `src/app/api/composer/generate-draft/route.ts`
- `src/app/api/composer/save/route.ts`

### Tests
- `tests/features/core/app/composer/create-context-draft.test.ts`
- `tests/features/core/app/composer/save-context-version.test.ts`

---

## Notes

- In `src/features/core/**`: ONLY relative imports. NO `@/` alias.
- In `src/app/**`: alias imports `@/` allowed.
- App layer must not mutate objects from domain. Return new objects.
- Tests in `tests/` mirroring `src/` structure.

---

## Instructions

Check off each task by changing `- [ ]` to `- [x]`.

---

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Run `git checkout -b feature/context-composer`

---

- [ ] 1.0 Implement App Layer Use Cases
  - [ ] 1.1 Create `src/features/core/app/composer/create-context-draft.ts`
    - Input: `sources: Source[]`, `mode: ComposerMode`
    - Output: `Promise<string>` (generated markdown)
    - Call LLM API to generate structured draft
    - Use relative imports
  - [ ] 1.2 Create `src/features/core/app/composer/save-context-version.ts`
    - Input: `{ contextId?: string, name: string, markdown: string, tags: string[], projectId: string }`
    - Logic: If no contextId, create new Context + first version. Else create new version.
    - Output: `{ context: Context, version: ContextVersion }`
    - Use repos from `../infra/db/` (relative imports)
  - [ ] 1.3 Write unit tests in `tests/features/core/app/composer/`

---

- [ ] 2.0 Build Composer Feature Structure
  - [ ] 2.1 Create folder structure:
    ```
    src/features/composer/
    ├── components/
    ├── hooks/
    └── types/
    ```
  - [ ] 2.2 Create `src/features/composer/types/index.ts`
    - `ComposerMode = 'reference-only' | 'guided-draft' | 'both'`
    - `WizardStep = 1 | 2 | 3 | 4`
    - `WizardState` type

---

- [ ] 3.0 Build Wizard State Hook
  - [ ] 3.1 Create `src/features/composer/hooks/use-wizard-state.ts`
    - State: currentStep, sources[], mode, draft, contextName, tags
    - Actions: addSource, removeSource, setMode, setDraft, setName, setTags, nextStep, prevStep

---

- [ ] 4.0 Build Wizard Layout
  - [ ] 4.1 Create `src/features/composer/components/wizard-layout.tsx`
    - Progress indicator showing 4 steps
    - Step titles: Add Sources → Select Mode → Generate Draft → Save
    - Dark theme styling
    - Slot for active step component

---

- [ ] 5.0 Build Step 1: Add Sources
  - [ ] 5.1 Create `src/features/composer/components/step-add-sources.tsx`
  - [ ] 5.2 File upload input: accept `.md`, `.txt`, `.pdf` (max 5MB)
  - [ ] 5.3 Paste text textarea
  - [ ] 5.4 Sources summary list with remove button
  - [ ] 5.5 Continue button (disabled if 0 sources)

---

- [ ] 6.0 Build Step 2: Select Mode
  - [ ] 6.1 Create `src/features/composer/components/step-select-mode.tsx`
  - [ ] 6.2 Radio group with 3 options:
    - Reference Only — "Store sources as-is, no AI"
    - Guided Draft — "AI generates structured context"
    - Both — "Store sources + generate draft"
  - [ ] 6.3 Continue button

---

- [ ] 7.0 Build Step 3: Guided Generation
  - [ ] 7.1 Create `src/features/composer/components/step-guided-generation.tsx`
  - [ ] 7.2 If mode is "reference-only", auto-skip to Step 4
  - [ ] 7.3 Loading state while generating draft
  - [ ] 7.4 Display generated markdown (read-only)
  - [ ] 7.5 Continue button to proceed to editor

---

- [ ] 8.0 Build Step 4: Editor & Save
  - [ ] 8.1 Create `src/features/composer/components/step-editor-save.tsx`
  - [ ] 8.2 Markdown textarea editor
  - [ ] 8.3 Context Name input (required)
  - [ ] 8.4 Tags input (comma-separated, optional)
  - [ ] 8.5 Save button → call API → show success → redirect

---

- [ ] 9.0 Integrate API Routes
  - [ ] 9.1 Create `src/app/api/composer/generate-draft/route.ts`
    - POST: validate input, call `create-context-draft` use case
  - [ ] 9.2 Create `src/app/api/composer/save/route.ts`
    - POST: validate input, call `save-context-version` use case
  - [ ] 9.3 Create `src/app/composer/page.tsx`
    - Import components with `@/features/composer/...`
    - Render WizardLayout with step components
    - Wire up wizard state

---

- [ ] 10.0 Final Testing
  - [ ] 10.1 Smoke test: complete full 4-step flow
  - [ ] 10.2 Verify "Reference Only" skips Step 3
  - [ ] 10.3 Verify save creates Context + ContextVersion in DB
  - [ ] 10.4 Run `npm test` — all tests pass
  - [ ] 10.5 Code review: verify import rules compliance
