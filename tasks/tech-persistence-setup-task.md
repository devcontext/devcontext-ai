# Tech Task — Persistence Setup (MVP)

## Overview

This is a **technical prerequisite** task that sets up the persistence layer for the Context Composer MVP. All product features (Context Composer, Context Store, MCP Exposure) will assume this layer already exists.

---

## Scope

### Deliverables
1. **Database Schema** — Supabase tables for `sources`, `contexts`, `context_versions`
2. **Row Level Security** — Owner-based access policies
3. **Domain Types** — Pure TypeScript types (no I/O, no side effects)
4. **Repositories** — CRUD-only, no business logic

### Out of Scope
- UI components
- API routes
- Business logic / use cases
- AI integration

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
- `tests/features/core/infra/db/sources-repository.test.ts`
- `tests/features/core/infra/db/contexts-repository.test.ts`

---

## Notes

- In `src/features/core/**`: ONLY relative imports. NO `@/` alias.
- Domain types must be PURE: no `Date`, `Date.now`, `new Date()`, `Math.random`, `process.env`, no DB/network calls.
- Repos must be CRUD-only, no business logic.
- Tests in `tests/` mirroring `src/` structure.

---

## Instructions

Check off each task by changing `- [ ]` to `- [x]`.

---

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Run `git checkout -b tech/persistence-setup`

---

- [ ] 1.0 Define Domain Types (Pure)
  - [ ] 1.1 Create `src/features/core/domain/types/sources.ts`
    ```ts
    export type Source = {
      id: string
      projectId: string
      name: string
      type: 'file' | 'text'
      content: string
      createdAt: string // ISO string, not Date object
    }

    export type SourceInput = Omit<Source, 'id' | 'createdAt'>
    ```
  - [ ] 1.2 Create `src/features/core/domain/types/contexts.ts`
    ```ts
    export type Context = {
      id: string
      projectId: string
      name: string
      tags: string[]
      createdAt: string
      updatedAt: string
    }

    export type ContextInput = Omit<Context, 'id' | 'createdAt' | 'updatedAt'>

    export type ContextVersion = {
      id: string
      contextId: string
      versionNumber: number
      markdown: string
      createdAt: string
    }

    export type ContextVersionInput = Omit<ContextVersion, 'id' | 'createdAt'>
    ```
  - [ ] 1.3 Update `src/features/core/domain/types/index.ts` to re-export new types
  - [ ] 1.4 Write basic type tests in `tests/features/core/domain/types/`

---

- [ ] 2.0 Create Database Schema (Supabase)
  - [ ] 2.1 Create `sources` table
    - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
    - `project_id` UUID NOT NULL
    - `name` TEXT NOT NULL
    - `type` TEXT NOT NULL CHECK (type IN ('file', 'text'))
    - `content` TEXT NOT NULL
    - `created_at` TIMESTAMPTZ DEFAULT now()
  - [ ] 2.2 Create `contexts` table
    - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
    - `project_id` UUID NOT NULL
    - `name` TEXT NOT NULL
    - `tags` TEXT[] DEFAULT '{}'
    - `created_at` TIMESTAMPTZ DEFAULT now()
    - `updated_at` TIMESTAMPTZ DEFAULT now()
  - [ ] 2.3 Create `context_versions` table
    - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
    - `context_id` UUID REFERENCES contexts(id) ON DELETE CASCADE
    - `version_number` INTEGER NOT NULL
    - `markdown` TEXT NOT NULL
    - `created_at` TIMESTAMPTZ DEFAULT now()
  - [ ] 2.4 Add unique constraint on `(context_id, version_number)`

---

- [ ] 3.0 Setup Row Level Security (RLS)
  - [ ] 3.1 Enable RLS on all three tables
  - [ ] 3.2 Create policy: `sources` — SELECT/INSERT/DELETE where `project_id` matches user's projects
  - [ ] 3.3 Create policy: `contexts` — SELECT/INSERT/UPDATE/DELETE where `project_id` matches user's projects
  - [ ] 3.4 Create policy: `context_versions` — SELECT/INSERT where `context_id` belongs to user's contexts

---

- [ ] 4.0 Implement Repositories (CRUD only)
  - [ ] 4.1 Create `src/features/core/infra/db/sources-repository.ts`
    - `createSource(input: SourceInput): Promise<Source>`
    - `getSourcesByProjectId(projectId: string): Promise<Source[]>`
    - `deleteSource(id: string): Promise<void>`
  - [ ] 4.2 Create `src/features/core/infra/db/contexts-repository.ts`
    - `createContext(input: ContextInput): Promise<Context>`
    - `getContextsByProjectId(projectId: string): Promise<Context[]>`
    - `getContextById(id: string): Promise<Context | null>`
    - `updateContext(id: string, updates: Partial<ContextInput>): Promise<Context>`
    - `deleteContext(id: string): Promise<void>`
  - [ ] 4.3 Add version methods to contexts-repository
    - `createContextVersion(input: ContextVersionInput): Promise<ContextVersion>`
    - `getVersionsByContextId(contextId: string): Promise<ContextVersion[]>`
    - `getLatestVersion(contextId: string): Promise<ContextVersion | null>`
  - [ ] 4.4 Write integration tests in `tests/features/core/infra/db/`

---

- [ ] 5.0 Verification
  - [ ] 5.1 Run `npm test` — all tests pass
  - [ ] 5.2 Manual verification: create source, context, version via Supabase dashboard
  - [ ] 5.3 Verify RLS blocks unauthorized access
  - [ ] 5.4 Code review: check import rules compliance (relative imports in core/)

---

## Completion Criteria

This task is complete when:
- [ ] All tables exist in Supabase with correct schema
- [ ] RLS policies are active and tested
- [ ] Domain types are defined and exported
- [ ] Repositories are functional with basic tests
- [ ] No business logic in repositories
