---
trigger: always_on
---

## Codebase Enforcement Rules (MANDATORY)

### Imports
- In `src/features/core/{domain,infra,app}/**`: ONLY relative imports. NO `@/` alias.
- In `src/app/**` and `src/features/shared/ui/**`: alias imports `@/` allowed.

### No placeholders
- Forbidden tokens: `...`, `TODO`, `FIXME`, `placeholder`.
- Missing info → STOP and ask.

### Domain purity
In `src/features/core/domain/**`:
- Forbidden: `Date`, `Date.now`, `new Date()`, `Math.random`, `process.env`, network/DB/fs, Next.js/Supabase imports, side effects, parameter mutation.

### App layer immutability
In `src/features/core/app/**`:
- Do not mutate objects returned from domain. Always return new objects.

### Infra boundaries
- DB repositories must live ONLY in `src/features/core/infra/db/**`.
- Repos must be CRUD-only, no business logic.

### Tests
- Tests must live in `tests/**` (outside `src/`), mirroring the `src/` structure.
