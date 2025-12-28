# Tech Task — Persistence Setup (MVP)

## Overview

Technical prerequisite for the Context Composer MVP. All product features assume this layer exists.

---

## MVP Decisions (Locked)

> **Owner-scoped for MVP**: Access is based on `projects.user_id = auth.uid()`.
> This is a **temporary simplification**. Schema is prepared for future `workspace_id` + memberships.

> **No `version_number`**: Latest version is determined by `ORDER BY created_at DESC LIMIT 1`.
> Simplifies restores, repos, and MCP logic.

---

## Scope

### Deliverables
1. **Database Schema** — Supabase tables: `sources`, `contexts`, `context_versions`
2. **Row Level Security** — Owner-scoped policies
3. **Domain Types** — Pure TypeScript types
4. **Repositories** — CRUD-only

### Out of Scope
- UI, API routes, business logic, AI integration

---

## Relevant Files

### Domain Types (PURE)
- `src/features/core/domain/types/sources.ts`
- `src/features/core/domain/types/contexts.ts`

### Infrastructure (CRUD only)
- `src/features/core/infra/db/sources-repository.ts`
- `src/features/core/infra/db/contexts-repository.ts`

### Tests
- `tests/features/core/domain/types/sources.test.ts`
- `tests/features/core/domain/types/contexts.test.ts`

---

## Notes

- In `src/features/core/**`: ONLY relative imports. NO `@/` alias.
- Domain types must be PURE (no Date objects, no DB calls).
- Repos = CRUD only, no business logic.
- **Tests (MVP)**: Domain type tests required. Infra tests optional (smoke test + manual verification acceptable).

---

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Run `git checkout -b tech/persistence-setup`

---

- [x] 1.0 Define Domain Types (Pure)
  - [x] 1.1 Create `src/features/core/domain/types/sources.ts`
  - [x] 1.2 Create `src/features/core/domain/types/contexts.ts`
  - [x] 1.3 Update `src/features/core/domain/types/index.ts` to re-export new types
  - [x] 1.4 Write basic type tests in `tests/features/core/domain/types/`

---

- [x] 2.0 Create Database Schema (Supabase)
  - [x] 2.1 Create `sources` table
  - [x] 2.2 Create `contexts` table
  - [x] 2.3 Create `context_versions` table
  - Migration file: `supabase/migrations/20241228000000_persistence_setup.sql`

---

- [x] 3.0 Setup Row Level Security (RLS)
  - [x] 3.1 Enable RLS on all tables
  - [x] 3.2-3.4 Owner-scoped policies created in migration

---

- [x] 4.0 Implement Repositories (CRUD only)
  - [x] 4.1 Create `src/features/core/infra/db/sources-repository.ts`
  - [x] 4.2 Create `src/features/core/infra/db/contexts-repository.ts`
  - [x] 4.3 Add version methods to contexts-repository

---

- [ ] 5.0 Verification
  - [ ] 5.1 Run `npm test` — domain type tests pass
  - [ ] 5.2 Manual verification via Supabase dashboard: create source, context, version
  - [ ] 5.3 Verify RLS blocks unauthorized access
  - [ ] 5.4 Code review: relative imports in `core/`

---

## Completion Criteria

- [ ] All tables exist with correct schema
- [ ] RLS policies active (owner-scoped)
- [ ] Domain types defined and exported
- [ ] Repositories functional
- [ ] No business logic in repositories
