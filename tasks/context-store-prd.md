# PRD — Context Store & Versioning (MVP)

## 1. Introduction / Overview
The **Context Store** allows developers to browse, audit, and manage the contexts they have created.

This feature provides **visibility and trust**, not enforcement or governance logic.

---

## 2. Goals
- Centralize all created contexts.
- Enable discovery via project and tags.
- Provide a clear, auditable version history.
- Allow safe restoration of past versions.

---

## 3. User Stories
- As a developer, I want to browse contexts by project.
- As a developer, I want to filter contexts using tags.
- As a developer, I want to see every version of a context.
- As a developer, I want to restore a past version.
- As a developer, I want to delete a context I no longer need.
- As a developer, I want a clear empty state when no contexts exist so I know what to do next.

---

## 4. Functional Requirements

### 4.1 Context Listing
- Show all contexts owned by the user.
- Display: Context Name, Project, Tags, Latest Update Date.

---

### 4.2 Empty State (Required)
1. If the user has no contexts, the system must display a **clear empty state**.
2. The empty state must:
   - Explain what a context is.
   - Indicate that no contexts exist yet.
   - Provide a primary action to **Create a new Context** (link to Context Composer).
3. The empty state must not expose advanced features or commands.

---

### 4.3 Filtering & Search
- Filter by **Project**.
- Filter by **Tags** (free-text match).
- Search by **Context Name**.

---

### 4.4 Version History
- Selecting a context opens a **detail view**.
- Show a **vertical timeline** of all versions.
- Each version shows:
  - Version number
  - Created date
- Selecting a version shows its full markdown content.

---

### 4.5 Actions
- **Restore Version**  
  Restoring creates a **new version entry** copied from the selected one (linear history, no pointer rewrites).
- **Delete Context**  
  Deletes the context and all versions after confirmation.

---

### 4.6 Metadata
- Tags are free-text, provided during save in the Composer.
- No tag management UI in MVP.

---

## 5. Non-Goals
- Diff views
- Version comments
- Tag CRUD
- Version pinning

---

## 6. Design Considerations
- Timeline UI must be readable and calm.
- Clear indication of which version is **Latest**.
- Empty state should feel instructional, not like an error.

---

## 7. Technical Considerations
- Supabase join between `Context` and `ContextVersion`.
- Optional pagination if versions > 20.

---

## 8. Success Metrics
- Context discovery < 3s
- Restore always results in a new version
- No accidental data loss
- Users can reach Context Composer from empty state in one click

---

## 9. Decisions (Locked)
- Restore = new version
- Versions immutable
