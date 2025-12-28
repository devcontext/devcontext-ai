## Relevant Files

- `src/app/dashboard/layout.tsx` - App Router layout containing the Dashboard Shell.
- `src/features/shared/components/layout/dashboard-shell.tsx` - Main layout wrapper (client component for sidebar state).
- `src/features/shared/components/layout/sidebar.tsx` - Collapsible navigation sidebar.
- `src/features/shared/components/layout/page-header.tsx` - Reusable header component for page titles.
- `src/features/shared/components/layout/content-container.tsx` - Standardized page wrapper to ensure consistent spacing.
- `src/app/page.tsx` - Root page (redirect logic).
- `src/app/dashboard/page.tsx` - Dashboard root (redirect logic).

### Notes

- **Refactor Only**: NO new logic, NO logic modification, NO UX improvements beyond unification.
- **Mandatory Order**:
  1. Create Dashboard Layout (sidebar + header + content).
  2. Move routes to `/dashboard` (no component rewrites).
  3. Wrap features with common layout.
  4. Remove duplicate layouts/wrappers.
- **Strict Prohibitions**:
  - NO layouts per feature.
  - NO new states.
  - NO refactoring of internal feature logic (Composer/Store).
- **Settings**: This is a visual placeholder only.
- **Layouts**: Ensure `src/app/dashboard/contexts/layout.tsx` and `src/app/dashboard/composer/layout.tsx` do NOT exist.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout `feature/ui-unification`
- [x] 1.0 Dashboard Foundation (Shared Components)
  - [x] 1.1 Create `Sidebar` component (Items: Contexts, Composer, Settings Placeholder)
  - [x] 1.2 Create `DashboardShell` component (Grid layout + Mobile responsiveness)
  - [x] 1.3 Create `PageHeader` and `ContentContainer` components
  - [x] 1.4 Create `src/app/dashboard/layout.tsx` implementing the Shell
- [x] 2.0 Route Migration & Refactor
  - [x] 2.1 Move `src/app/contexts` to `src/app/dashboard/contexts`
  - [x] 2.2 Move `src/app/composer` to `src/app/dashboard/composer`
  - [x] 2.3 Update internal `Link` paths / `useRouter` pushes (add `/dashboard` prefix)
    - Search for: `push("/contexts")`, `href="/contexts"`, `push("/composer")`, `href="/composer"`
  - [x] 2.4 Remove feature-specific layouts (`contexts/layout.tsx` if exists) to enforce Dashboard Layout
- [x] 3.0 Clean Up & Redirects
  - [x] 3.1 Implement Root Redirect (`/` -> `/dashboard`)
  - [x] 3.2 Implement Dashboard Redirect (`/dashboard` -> `/dashboard/contexts`)
  - [x] 3.3 Verify no orphan Page files in `src/app` root (except `page.tsx` and `layout.tsx`)
- [x] 4.0 Verification
  - [x] 4.1 Verify Sidebar navigation works (Active states are correct)
  - [x] 4.2 Validate Composer flow works under new URL (Create -> Save -> Redirect)
  - [x] 4.3 Validate Context Store flow works under new URL (List -> Detail -> Restore)
  - [x] 4.4 Confirm "Settings" is purely visual (non-functional)
  - [x] 4.5 Ensure responsive behavior (Hamburger menu toggles sidebar on mobile)
