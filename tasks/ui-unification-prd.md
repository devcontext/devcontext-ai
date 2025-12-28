# PRD — UI Unification / Dashboard Shell

## 1. Introduction / Overview
This phase aims to unify all separate core features (Context Store, Composer) under a single, cohesive **Dashboard Shell**. By moving strictly to a `/dashboard` route structure, we prepare the application for a public landing page at root `/` while providing a consistent, professional user experience for the logged-in area.

## 2. Goals
- **Consistency**: Establish a single source of truth for layout, navigation, and spacing.
- **Scalability**: Allow future features (e.g., Settings, Teams) to be added without new layout work.
- **Isolation**: Clear separation between Public Website (`/`) and App (`/dashboard`).

## 3. User Stories
- As a user, I want a persistent sidebar so I can easily switch between "My Contexts" and "Create Context".
- As a user, I want a consistent header area so I always know where I am.
- As a user, I want the application to look like a single cohesive product, not separate pages.

## 4. Functional Requirements

### 4.1 Route Structure
- **Move** all app features under `/dashboard`:
  - `/contexts` -> `/dashboard/contexts`
  - `/composer` -> `/dashboard/composer`
  - `/contexts/[id]` -> `/dashboard/contexts/[id]`
- **Root Redirects**:
  - `/dashboard` should redirect to `/dashboard/contexts`.
  - `/` is reserved for Marketing/Landing (Future).

### 4.2 Dashboard Layout
- **File**: `src/app/dashboard/layout.tsx`
- **Dashboard Shell**: Definition = Sidebar + Header + Content Container. No business logic or feature logic included.
- **Sidebar**:
  - Fixed on desktop, collapsible/overlay on mobile.
  - Items:
    1. **Contexts** (List icon) - Links to `/dashboard/contexts`
    2. **Composer** (Plus/Pen icon) - Links to `/dashboard/composer`
    3. **Settings** (Gear icon) - **VISUAL PLACEHOLDER ONLY**. No routes, pages, or logic associated.
- **Header**:
  - Minimal breadcrumbs or title.
  - User profile placeholder.

### 4.3 Shared Components
- **`DashboardShell`**: The main grid container.
- **`PageHeader`**: Standardized header for each page title.
- **`ContentContainer`**: Standardized padding and max-width wrapper.

## 5. Non-Goals (Out of Scope)
- **NO Logic Changes**: The internal working of the Store or Composer must remain exactly the same.
- **NO New Features**: Functional changes to Contexts or Composer are forbidden.
- **NO Landing Page**: We are creating the *space* for the landing page at `/`, but not building it yet.
- **NO Auth Logic**: We assume the user is "logged in" for now (using existing dev config).
- **NO Feature Layouts**: Features (Contexts, Composer) **CANNOT** define their own layouts. All pages must render inside the shared Dashboard Layout.

## 6. Technical Considerations
- **Shadcn UI**: Use `Sidebar`, `Sheet`, or standard Flex/Grid layouts using existing `shadcn` components.
- **Refactoring**: requires moving `src/app/contexts` and `src/app/composer` folders into `src/app/dashboard/`.
- **Link Updates**: All internal `Link` components must be updated to include `/dashboard` prefix.

## 7. Success Metrics
- User can navigate between Store and Composer without full page reload feels.
- Layout does not "jump" between pages.
- No broken links or 404s on existing flows.
- **Technical Success**: After refactor, no feature defines its own layout or top-level page containers.
