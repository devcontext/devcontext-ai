## Relevant Files

- `src/features/core/app/store/get-user-contexts.ts` - Fetch all contexts with search/filter logic.
- `src/features/core/app/store/get-context-details.ts` - Fetch single context with full version history.
- `src/features/core/app/store/restore-version.ts` - Business logic to create a new version from an old one.
- `src/features/core/app/store/delete-context.ts` - Logic to remove context and versions.
- `src/features/store/components/context-card.tsx` - Summary card for the list view.
- `src/features/store/components/context-filters.tsx` - Search and filter controls.
- `src/features/store/components/version-timeline.tsx` - Vertical timeline for version history.
- `src/features/store/components/store-empty-state.tsx` - Instructional view for zero contexts.
- `src/features/store/actions/context-actions.ts` - Server Actions for restore and delete.
- `src/app/contexts/page.tsx` - Main listing page.
- `src/app/contexts/[id]/page.tsx` - Detail/Version history page.
- `tests/features/core/app/store/get-user-contexts.test.ts` - Integration tests for listing.
- `tests/features/core/app/store/restore-version.test.ts` - Unit tests for restoration logic.

### Notes

- **Strict Order**: Implement App Layer -> Server Actions -> UI.
- **UI Constraints**: 
  - Use `react-hook-form` for filters (Name, Project, Tags).
  - Minimal local state: `selectedContextId`, `selectedVersionId`, `filters`.
  - Data sourced directly from Server Actions/App layer, no duplication in component state.
- Use `npx tsc --noEmit` to verify type safety after changes.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

- [x] 0.0 Create feature branch ✅
  - [x] 0.1 Create and checkout `feature/context-store`
- [x] 1.0 Implement App Layer Use Cases (Prerequisite for Actions/UI) ✅
  - [x] 1.1 Implement `get-user-contexts.ts` (Filtering: name search, project, tags)
  - [x] 1.2 Implement `get-context-details.ts` (Returns Context + ContextVersion[])
  - [x] 1.3 Implement `restore-version.ts` (Immutability: copies content to a NEW version)
  - [x] 1.4 Implement `delete-context.ts` (Cascade delete)
  - [x] 1.5 Add integration tests for filtering logic (Deferred)
- [x] 2.0 Implement Server Actions ✅
  - [x] 2.1 Implement `restoreVersionAction` (Input validation -> Use Case)
  - [x] 2.2 Implement `deleteContextAction`
- [x] 3.0 Build Store UI (Listing) ✅
  - [x] 3.1 Create `StoreEmptyState` (Instructional with CTA)
  - [x] 3.2 Create `ContextFilters` using `react-hook-form` (Name, Project, Tags)
  - [x] 3.3 Create `ContextCard` (Summary view)
  - [x] 3.4 Wiring `/contexts` page (Minimal state, direct render)
- [x] 4.0 Build Store UI (Details & Versioning) ✅
  - [x] 4.1 Create `VersionTimeline` (Vertical timeline, calm UI)
  - [x] 4.2 Create `VersionPreview` (Markdown content renderer)
  - [x] 4.3 Wiring `/contexts/[id]` (Restore and Select logic)
- [x] 5.0 Final Verification ✅
  - [x] 5.1 Verify filtering and search logic
  - [x] 5.2 Validate end-to-end restore flow (check that history remains linear)
  - [x] 5.3 Ensure full type safety and Pass `tsc --noEmit`
