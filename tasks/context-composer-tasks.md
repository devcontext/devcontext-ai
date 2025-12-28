# Context Composer — Task List

## Prerequisites

> ⚠️ **This task assumes `tech-persistence-setup.md` is complete.** ✅

---

## Tasks

- [x] 0.0 Create feature branch
- [x] 1.0 Implement App Layer Use Cases
  - [x] 1.1 `create-context-draft.ts`
  - [x] 1.2 `save-context-version.ts`
  - [ ] 1.3 Unit tests (deferred)
- [x] 2.0 Build Composer Feature Structure
- [x] 3.0 Build Wizard State Hook
- [x] 4.0 Build Wizard Layout
- [x] 5.0 Build Step 1: Add Sources
- [x] 6.0 Build Step 2: Select Mode
- [x] 7.0 Build Step 3: Guided Generation
- [x] 8.0 Build Step 4: Editor & Save
- [x] 9.0 Integrate App Routes & Actions
  - [x] 9.1 `/api/composer/generate-draft` (API Route)
  - [x] 9.2 `save-context.ts` (Server Action) ✅
  - [x] 9.3 `/composer/page.tsx`
- [x] 10.0 Final Testing (Manual E2E Verified by User) ✅

---

## Files Created

### App Layer
- `src/features/core/app/composer/create-context-draft.ts`
- `src/features/core/app/composer/save-context-version.ts`

### Composer Feature
- `src/features/composer/types/index.ts`
- `src/features/composer/hooks/use-wizard-state.ts`
- `src/features/composer/actions/save-context.ts` (Server Action)
- `src/features/composer/components/wizard-layout.tsx`
- `src/features/composer/components/step-add-sources.tsx`
- `src/features/composer/components/step-select-mode.tsx`
- `src/features/composer/components/step-guided-generation.tsx`
- `src/features/composer/components/step-editor-save.tsx`

### App Routes
- `src/app/composer/page.tsx`
- `src/app/api/composer/generate-draft/route.ts`

---

## ✅ MVP IMPLEMENTATION COMPLETE

End-to-end flow verified. Saving persistence working via Server Actions.
