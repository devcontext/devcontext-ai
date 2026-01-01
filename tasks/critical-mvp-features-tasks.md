# Critical MVP Features - Task List

## Relevant Files

### Feature 1: API Key Management

#### Database

- `supabase/migrations/20260101_create_api_keys_table.sql` - Database schema for API keys table with indexes

#### Domain Layer

- `src/features/core/domain/api-keys/generate-api-key.ts` - Pure function to generate secure random API key
- `src/features/core/domain/api-keys/hash-api-key.ts` - Pure function to hash API key using SHA-256
- `src/features/core/domain/api-keys/types.ts` - Type definitions for API keys

#### Infrastructure Layer

- `src/features/core/infra/db/api-key-repository.ts` - CRUD operations for API keys
- `tests/features/core/infra/db/api-key-repository.test.ts` - Integration tests for repository

#### App Layer

- `src/features/core/app/api-keys/generate-user-api-key.ts` - Use case for generating API key
- `src/features/core/app/api-keys/list-user-api-keys.ts` - Use case for listing user's API keys
- `src/features/core/app/api-keys/revoke-user-api-key.ts` - Use case for revoking API key
- `tests/features/core/app/api-keys/generate-user-api-key.test.ts` - Unit tests for key generation

#### UI Layer - Settings Feature

- `src/features/settings/types/index.ts` - Type definitions for settings feature
- `src/features/settings/components/api-key-list.tsx` - Component to display list of API keys
- `src/features/settings/components/generate-key-dialog.tsx` - Modal for generating new API key
- `src/features/settings/components/api-key-item.tsx` - Individual API key row component
- `src/features/settings/components/mcp-config-snippet.tsx` - Component showing MCP config snippets
- `src/features/settings/actions/api-key-actions.ts` - Server actions for API key operations
- `src/app/dashboard/settings/page.tsx` - Settings page route

#### Shared Components

- `src/features/shared/components/layout/sidebar.tsx` - Update to make Settings link functional

---

### Feature 2: Form Validation & Feedback

#### Toast System

- `src/features/shared/components/providers/toast-provider.tsx` - Sonner toast provider wrapper
- `src/app/layout.tsx` - Root layout (modify to add toast provider)

#### Composer Updates

- `src/features/composer/components/step-editor-save.tsx` - Modify to add validation and loading states
- `src/features/composer/actions/save-context.ts` - Modify to return structured errors

#### Store Updates

- `src/features/store/components/context-card.tsx` - Modify to add delete confirmation
- `src/features/store/components/version-timeline.tsx` - Modify to add restore confirmation and loading
- `src/features/store/actions/context-actions.ts` - Modify to return structured errors

#### Shared Dialogs

- `src/features/shared/components/ui/confirmation-dialog.tsx` - Reusable confirmation dialog component

---

### Feature 3: Onboarding & First-Time Experience

#### Empty States

- `src/features/store/components/store-empty-state.tsx` - Modify to enhance with better copy and visuals

#### Context Usage

- `src/features/store/components/context-usage-guide.tsx` - New component showing how to use a context
- `src/app/dashboard/contexts/[id]/page.tsx` - Modify to add usage guide section

#### Settings - MCP Guide

- `src/features/settings/components/mcp-integration-guide.tsx` - Component with MCP setup instructions

---

### Notes

- **Implementation Order**: API Keys → Form Validation → Onboarding (sequential)
- **Testing**: Unit tests only for API key generation and hashing (critical security functions)
- **Architecture**: Strict adherence to Domain → Infra → App → UI layer separation
- Use `pnpm test` to run all tests
- Use `npx tsc --noEmit` to verify type safety

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Create migration file` → `- [x] 1.1 Create migration file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

### Phase 0: Setup

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout `feature/critical-mvp-features`

---

### Phase 1: API Key Management (Day 1 - 4-6 hours)

- [x] 1.0 Feature 1: API Key Management - Database Setup
  - [x] 1.1 Create migration file `supabase/migrations/20260101_create_api_keys_table.sql`
  - [x] 1.2 Define table schema with all required fields (id, user_id, key_hash, name, last_used_at, revoked_at, created_at, updated_at)
  - [x] 1.3 Add foreign key constraint to auth.users
  - [x] 1.4 Create index on user_id for listing performance
  - [x] 1.5 Create index on key_hash for authentication lookups
  - [x] 1.6 Add RLS policies for user ownership
  - [x] 1.7 Run migration locally and verify schema

- [x] 2.0 Feature 1: API Key Management - Domain Layer
  - [x] 2.1 Create `src/features/core/domain/api-keys/types.ts` with ApiKey interface
  - [x] 2.2 Create `src/features/core/domain/api-keys/generate-api-key.ts`
    - Pure function using crypto.randomBytes(32)
    - Return key with `dctx_` prefix
  - [x] 2.3 Create `src/features/core/domain/api-keys/hash-api-key.ts`
    - Pure function using SHA-256
    - Return hex string hash
  - [x] 2.4 Create `src/features/core/domain/api-keys/validate-api-key-format.ts`
    - Validate key format (prefix + length)

- [x] 3.0 Feature 1: API Key Management - Infrastructure Layer
  - [x] 3.1 Create `src/features/core/infra/db/api-key-repository.ts`
  - [x] 3.2 Implement `createApiKey(userId, name, keyHash)` method
  - [x] 3.3 Implement `listUserApiKeys(userId)` method (only active keys)
  - [x] 3.4 Implement `findByKeyHash(keyHash)` method for authentication
  - [x] 3.5 Implement `revokeApiKey(id, userId)` method (soft delete)
  - [x] 3.6 Implement `updateLastUsed(id)` method
  - [x] 3.7 Add proper error handling and type safety

- [x] 4.0 Feature 1: API Key Management - App Layer
  - [x] 4.1 Create `src/features/core/app/api-keys/generate-user-api-key.ts`
    - Call domain generateApiKey()
    - Call domain hashApiKey()
    - Call repository createApiKey()
    - Return plain key (only time it's visible)
  - [x] 4.2 Create `src/features/core/app/api-keys/list-user-api-keys.ts`
    - Call repository listUserApiKeys()
    - Return formatted list with metadata
  - [x] 4.3 Create `src/features/core/app/api-keys/revoke-user-api-key.ts`
    - Validate ownership
    - Call repository revokeApiKey()
  - [x] 4.4 Create `src/features/core/app/api-keys/validate-api-key.ts`
    - Hash provided key
    - Call repository findByKeyHash()
    - Update last_used_at if valid

- [x] 5.0 Feature 1: API Key Management - UI Components
  - [x] 5.1 Create `src/features/settings/types/index.ts` with component prop types
  - [x] 5.2 Create `src/features/settings/components/api-key-list.tsx`
    - Display table of API keys
    - Show name, created date, last used date
    - Include revoke button for each key
  - [x] 5.3 Create `src/features/settings/components/api-key-item.tsx`
    - Individual row component
    - Copy button for key name
    - Revoke button with confirmation
  - [x] 5.4 Create `src/features/settings/components/generate-key-dialog.tsx`
    - Modal with key name input
    - Generate button
    - Show generated key once with copy button
    - Warning message about saving key
  - [x] 5.5 Create `src/features/settings/components/mcp-config-snippet.tsx`
    - Tabs for Cursor, Claude Desktop, Antigravity
    - Auto-populate with user's API key
    - Copy button for each snippet
    - Syntax highlighting for JSON

- [x] 6.0 Feature 1: API Key Management - Settings Page & Integration
  - [x] 6.1 Create `src/features/settings/actions/api-key-actions.ts`
    - `generateApiKeyAction(name: string)` server action
    - `revokeApiKeyAction(id: string)` server action
    - Proper error handling and validation
  - [x] 6.2 Create `src/app/dashboard/settings/page.tsx`
    - Fetch user's API keys
    - Render ApiKeyList component
    - Render GenerateKeyDialog
    - Render McpConfigSnippet
  - [x] 6.3 Update `src/features/shared/components/layout/sidebar.tsx`
    - Make Settings link functional (href="/dashboard/settings")
    - Add active state for Settings route
  - [ ] 6.4 Add proper loading states and error handling

- [ ] 7.0 Feature 1: API Key Management - Testing & Verification
  - [ ] 7.1 Create `tests/features/core/domain/api-keys/generate-api-key.test.ts`
    - Test key format (prefix + length)
    - Test uniqueness
  - [ ] 7.2 Create `tests/features/core/domain/api-keys/hash-api-key.test.ts`
    - Test deterministic hashing
    - Test same input = same output
  - [ ] 7.3 Create `tests/features/core/app/api-keys/generate-user-api-key.test.ts`
    - Test full flow
    - Test error handling
  - [ ] 7.4 Manual testing: Generate key, list keys, revoke key
  - [ ] 7.5 Manual testing: Copy MCP config and test with Cursor
  - [ ] 7.6 Verify revoked keys fail authentication

---

### Phase 2: Form Validation & Feedback (Day 2 - 2-3 hours)

- [ ] 8.0 Feature 2: Form Validation - Toast System Setup
  - [ ] 8.1 Install sonner: `pnpm add sonner`
  - [ ] 8.2 Create `src/features/shared/components/providers/toast-provider.tsx`
    - Wrap Toaster component from sonner
    - Configure theme and position
  - [ ] 8.3 Update `src/app/layout.tsx`
    - Add ToastProvider to component tree
    - Place after ThemeProvider

- [ ] 9.0 Feature 2: Form Validation - Composer Validation
  - [ ] 9.1 Update `src/features/composer/components/step-editor-save.tsx`
    - Add state for validation errors
    - Add inline error messages for name field
    - Add red border styling for invalid fields
    - Add helper text under inputs
    - Show error message when save button is disabled
    - Clear errors on input change
  - [ ] 9.2 Add loading state to save button
    - Show spinner during save operation
    - Disable button while saving
  - [ ] 9.3 Update `src/features/composer/actions/save-context.ts`
    - Return structured error responses
    - Include field-level validation errors
  - [ ] 9.4 Add success toast after successful save
  - [ ] 9.5 Add error toast on save failure

- [ ] 10.0 Feature 2: Form Validation - Confirmation Dialogs
  - [ ] 10.1 Create `src/features/shared/components/ui/confirmation-dialog.tsx`
    - Reusable dialog component
    - Props: title, description, onConfirm, onCancel
    - Danger variant for destructive actions
  - [ ] 10.2 Update `src/features/store/components/context-card.tsx`
    - Add confirmation dialog before delete
    - Show dialog with context name
    - Add success toast after delete
  - [ ] 10.3 Update `src/features/store/components/version-timeline.tsx`
    - Add confirmation dialog before restore
    - Show version number in dialog
    - Add success toast after restore
  - [ ] 10.4 Update `src/features/store/actions/context-actions.ts`
    - Return structured responses for better error handling

- [ ] 11.0 Feature 2: Form Validation - Loading States
  - [ ] 11.1 Add skeleton screens to context list
    - Create skeleton component for context cards
    - Show while loading contexts
  - [ ] 11.2 Add loading state to context details
    - Show skeleton for version timeline
    - Show skeleton for content preview
  - [ ] 11.3 Add loading spinners to action buttons
    - Delete button
    - Restore button
    - Save button (already done in 9.2)

- [ ] 12.0 Feature 2: Form Validation - Testing & Verification
  - [ ] 12.1 Manual test: Try to save context without name
  - [ ] 12.2 Manual test: Verify error message appears
  - [ ] 12.3 Manual test: Enter name and verify error clears
  - [ ] 12.4 Manual test: Save context and verify success toast
  - [ ] 12.5 Manual test: Delete context and verify confirmation dialog
  - [ ] 12.6 Manual test: Restore version and verify confirmation
  - [ ] 12.7 Verify all loading states work correctly

---

### Phase 3: Onboarding & First-Time Experience (Day 3 - 3-4 hours)

- [ ] 13.0 Feature 3: Onboarding - Empty States Enhancement
  - [ ] 13.1 Update `src/features/store/components/store-empty-state.tsx`
    - Improve copy with clear value proposition
    - Add lucide-react icon (e.g., FileText, Sparkles)
    - Add "Quick Start" section with 3 steps
    - Make CTA button more prominent
    - Add visual hierarchy with better spacing

- [ ] 14.0 Feature 3: Onboarding - Context Usage Instructions
  - [ ] 14.1 Create `src/features/store/components/context-usage-guide.tsx`
    - Display MCP URI (format: `context://{id}`)
    - Add "Copy URI" button
    - Show brief instructions on accessing via MCP
    - Link to Settings → MCP Integration
    - Use card/panel styling for visual separation
  - [ ] 14.2 Update `src/app/dashboard/contexts/[id]/page.tsx`
    - Add "How to Use This Context" section
    - Render ContextUsageGuide component
    - Place below context details, above version history

- [ ] 15.0 Feature 3: Onboarding - MCP Integration Guide
  - [ ] 15.1 Create `src/features/settings/components/mcp-integration-guide.tsx`
    - Create tabs for each IDE (Cursor, Claude Desktop, Antigravity)
    - Show step-by-step setup instructions for each
    - Include config file locations
    - Highlight API key requirement
    - Link to API Keys section
  - [ ] 15.2 Update `src/app/dashboard/settings/page.tsx`
    - Add "MCP Integration" tab/section
    - Render MCP integration guide
    - Ensure proper layout with API Keys section

- [ ] 16.0 Feature 3: Onboarding - Testing & Verification
  - [ ] 16.1 Clear all contexts (or use fresh account)
  - [ ] 16.2 Verify improved empty state is helpful
  - [ ] 16.3 Create first context via CTA
  - [ ] 16.4 View context details
  - [ ] 16.5 Verify "How to Use" section appears
  - [ ] 16.6 Copy MCP URI and verify format
  - [ ] 16.7 Navigate to Settings
  - [ ] 16.8 Verify MCP integration guide is clear
  - [ ] 16.9 Test config snippets with actual IDE

---

### Phase 4: Final Testing & Polish

- [ ] 17.0 Final End-to-End Testing & Polish
  - [ ] 17.1 Complete full user flow: signup → generate API key → create context → configure MCP
  - [ ] 17.2 Test all validation scenarios
  - [ ] 17.3 Test all confirmation dialogs
  - [ ] 17.4 Verify all toasts appear correctly
  - [ ] 17.5 Test MCP connection with Cursor
  - [ ] 17.6 Test MCP connection with Claude Desktop (if available)
  - [ ] 17.7 Check mobile responsiveness
  - [ ] 17.8 Run `npx tsc --noEmit` to verify type safety
  - [ ] 17.9 Fix any remaining bugs or UI issues
  - [ ] 17.10 Update README if needed
  - [ ] 17.11 Commit and push feature branch
  - [ ] 17.12 Create PR for review
