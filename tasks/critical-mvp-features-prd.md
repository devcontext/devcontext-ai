# PRD: Critical MVP Features - DevContext AI

## 1. Introduction/Overview

DevContext AI has completed its core technical implementation (Context Composer, Context Store, MCP Server), but a UX audit revealed **3 critical blockers** preventing user launch:

1. **No API Key Management** - Users cannot configure MCP integration (core value proposition)
2. **Poor Form Validation** - Users get stuck without clear feedback
3. **Weak Onboarding** - First-time users don't understand what to do

This PRD defines the **minimum viable implementation** of these 3 features to make the product ready for user testing within **1-3 days**.

**Problem Statement**: Users cannot successfully set up and use DevContext AI because critical UX elements are missing, despite the underlying functionality being complete.

---

## 2. Goals

1. **Enable MCP Integration**: Users can generate API keys and configure MCP clients (Cursor, Claude, Antigravity) without external documentation
2. **Reduce User Friction**: Clear validation feedback prevents confusion and errors
3. **Improve First Impression**: New users understand the product value and know how to get started
4. **Ship Fast**: Complete implementation in 1-3 days with focused scope

---

## 3. User Stories

### API Key Management

- **As a developer**, I want to generate an API key so that I can connect my IDE to DevContext AI via MCP
- **As a developer**, I want to see my active API keys so that I can manage my integrations
- **As a developer**, I want to revoke compromised keys so that I can maintain security
- **As a developer**, I want to copy MCP configuration snippets so that I can quickly set up my IDE

### Form Validation

- **As a user**, I want to see clear error messages when I make mistakes so that I can fix them quickly
- **As a user**, I want confirmation before deleting important data so that I don't lose work accidentally
- **As a user**, I want to see loading states so that I know the system is working
- **As a user**, I want success notifications so that I know my actions completed

### Onboarding

- **As a new user**, I want to understand what DevContext AI does so that I can decide if it's useful for me
- **As a new user**, I want clear instructions on how to use my contexts so that I can get value immediately
- **As a new user**, I want to see examples and guidance so that I don't feel lost

---

## 4. Functional Requirements

### Feature 1: API Key Management (Priority 1)

#### Database

1. Create `api_keys` table with fields: `id`, `user_id`, `key_hash`, `name`, `last_used_at`, `revoked_at`, `created_at`, `updated_at`
2. Store SHA-256 hash of keys, never plain text
3. Support soft delete via `revoked_at` timestamp
4. Index on `user_id` and `key_hash` for performance

#### Backend Logic

5. Generate secure random API keys with prefix `dctx_` using `crypto.randomBytes`
6. Hash keys before storage using SHA-256
7. Validate ownership before any key operations
8. Track `last_used_at` when keys are used for MCP authentication
9. Support listing only active (non-revoked) keys per user

#### UI - Settings Page

10. Create `/dashboard/settings` route with functional navigation from sidebar
11. Display list of user's API keys showing: name, created date, last used date
12. Provide "Generate New Key" button that opens a modal
13. In generation modal: require key name input, generate key on submit
14. Show generated key **only once** with prominent "Copy" button and warning
15. Provide "Revoke" action for each key with confirmation dialog
16. Display MCP configuration snippets for Cursor, Claude Desktop, and Antigravity
17. Auto-populate snippets with user's API key and project URL
18. Provide "Copy" buttons for each configuration snippet

#### Security

19. Keys must be shown only once during generation
20. All key operations must validate user ownership
21. Revoked keys must not authenticate MCP requests

---

### Feature 2: Form Validation & Feedback (Priority 2)

#### Toast Notifications

22. Install and configure `sonner` toast library
23. Add toast provider to root layout
24. Show success toast on context save with message "Context saved successfully"
25. Show error toast on save failure with specific error message
26. Show success toast on context delete
27. Show success toast on version restore

#### Composer Validation

28. Add inline error messages for required fields (name, content)
29. Show red border on invalid fields
30. Display helper text under inputs explaining requirements
31. Keep "Save Context" button disabled with visible error message when invalid
32. Clear error messages when user corrects the input
33. Show loading spinner on "Save Context" button during save operation

#### Confirmation Dialogs

34. Add confirmation dialog before deleting a context
35. Add confirmation dialog before restoring a version
36. Dialogs must clearly state the action and its consequences

#### Loading States

37. Show skeleton screens while loading context list
38. Show loading state while loading context details
39. Show spinner on action buttons during async operations

---

### Feature 3: Onboarding & First-Time Experience (Priority 3)

#### Empty States

40. Enhance Context Store empty state with clear value proposition
41. Add visual icon or illustration to empty state
42. Include "Quick Start" guide with 3 simple steps
43. Provide prominent CTA button "Create Your First Context"

#### Context Usage Instructions

44. Add "How to Use This Context" section in context details page
45. Display MCP URI for the specific context (format: `context://{id}`)
46. Provide "Copy URI" button next to the URI
47. Show brief instructions on how to access this context via MCP
48. Link to Settings → MCP Integration for full setup guide

#### Settings - MCP Integration Guide

49. Add "MCP Integration" section in Settings page
50. Display configuration snippets for each supported IDE
51. Include step-by-step setup instructions for each IDE
52. Highlight that API key is required (link to API Keys section)

---

## 5. Non-Goals (Out of Scope)

- **Advanced API Key Features**: Scopes, permissions, expiration dates, rate limiting
- **Automated Testing**: E2E tests (manual testing only for this iteration)
- **Welcome Modal/Tour**: Interactive onboarding wizard
- **Public Landing Page**: Marketing site for non-authenticated users
- **Analytics**: Tracking of user behavior or feature usage
- **API Key Rotation**: Automatic or scheduled key rotation
- **Multiple Keys Per User**: Users can have multiple keys, but no special management UI
- **Billing/Usage Limits**: No restrictions on API key usage

---

## 6. Design Considerations

### UI/UX Principles

- **Consistency**: Use existing design system and components
- **Clarity**: Every action should have clear feedback
- **Security**: Emphasize that API keys are sensitive (show once, copy to clipboard)
- **Simplicity**: Minimal clicks to complete critical tasks

### Component Reuse

- Use existing modal/dialog components from shared UI
- Use existing button, input, and form components
- Maintain consistent spacing and typography

### Accessibility

- All interactive elements must be keyboard accessible
- Error messages must be announced to screen readers
- Sufficient color contrast for all text

---

## 7. Technical Considerations

### Database Migration

- Create migration file: `supabase/migrations/20260101_create_api_keys_table.sql`
- Run migration on local dev environment first
- Test rollback scenario

### Architecture Adherence

- Follow existing Domain → Infra → App layer separation
- API key logic in `src/features/core/domain/api-keys/`
- Repository in `src/features/core/infra/db/api-key-repository.ts`
- Use cases in `src/features/core/app/api-keys/`
- UI in `src/features/settings/`

### Dependencies

- Add `sonner` for toast notifications (lightweight, modern)
- No other new dependencies required

### Security Best Practices

- Use `crypto.randomBytes(32)` for key generation
- Hash with SHA-256 before storage
- Never log or expose plain keys after initial generation
- Validate ownership on all operations

---

## 8. Success Metrics

### Quantitative

- **API Key Generation Rate**: >80% of users generate at least one API key within first session
- **MCP Connection Success**: >70% of users successfully connect MCP client after following instructions
- **Form Completion Rate**: >90% of users successfully save their first context without errors
- **Time to First Context**: <5 minutes from signup to first saved context

### Qualitative

- Users can set up MCP integration without asking for help
- Users understand what to do when they land on empty dashboard
- Users don't get stuck on form validation errors
- Users feel confident the system is working (via feedback)

---

## 9. Open Questions

1. **API Key Naming**: Should we auto-generate names (e.g., "Key 1", "Key 2") or always require user input?
   - **Decision**: Require user input for better organization

2. **Key Limit**: Should we limit the number of active keys per user?
   - **Decision**: No limit for MVP, monitor usage

3. **MCP URI Format**: Should we use `context://{id}` or full URL?
   - **Decision**: Use `context://{id}` for consistency with MCP spec

4. **Toast Duration**: How long should success toasts stay visible?
   - **Decision**: 3 seconds (Sonner default)

5. **Empty State Illustration**: Custom illustration or icon library?
   - **Decision**: Use lucide-react icons (already in project)

---

## 10. Implementation Timeline

### Day 1: API Key Management (4-6 hours)

- Morning: Database migration + Domain/Infra layers
- Afternoon: App layer + Settings UI
- Evening: Testing + bug fixes

### Day 2: Form Validation (2-3 hours)

- Morning: Install Sonner + add validation to Composer
- Afternoon: Add confirmation dialogs + loading states
- Evening: Testing

### Day 3: Onboarding (3-4 hours)

- Morning: Improve empty states
- Afternoon: Add context usage instructions + MCP guide
- Evening: End-to-end testing + polish

**Total**: 9-13 hours over 3 days

---

## 11. Acceptance Criteria

### API Key Management

- [ ] User can navigate to Settings from sidebar
- [ ] User can generate a new API key with a custom name
- [ ] Generated key is shown only once with copy button
- [ ] User can see list of all active keys
- [ ] User can revoke a key
- [ ] Revoked keys do not appear in active list
- [ ] MCP config snippets are displayed with user's API key
- [ ] Config snippets can be copied to clipboard
- [ ] Revoked keys fail MCP authentication

### Form Validation

- [ ] Required fields show error message when empty
- [ ] Error messages clear when user enters valid input
- [ ] Save button is disabled with clear error when form is invalid
- [ ] Success toast appears after saving context
- [ ] Error toast appears if save fails
- [ ] Loading spinner shows during save operation
- [ ] Confirmation dialog appears before delete
- [ ] Confirmation dialog appears before restore

### Onboarding

- [ ] Empty state shows clear value proposition
- [ ] Empty state includes quick start guide
- [ ] CTA button is prominent and functional
- [ ] Context details page shows "How to Use" section
- [ ] MCP URI is displayed and copyable
- [ ] Settings includes MCP integration guide
- [ ] Setup instructions are clear and complete

---

## 12. Testing Plan

### Manual Testing Checklist

#### API Keys

1. Generate new API key
2. Verify key is shown only once
3. Copy key to clipboard
4. Verify key appears in list
5. Revoke key
6. Verify revoked key is removed from list
7. Test MCP authentication with valid key
8. Test MCP authentication with revoked key (should fail)
9. Copy MCP config snippet
10. Paste into Cursor config and verify connection

#### Form Validation

1. Open Composer
2. Try to save without name (verify error)
3. Enter name (verify error clears)
4. Save context (verify success toast)
5. Delete context (verify confirmation dialog)
6. Confirm delete (verify success toast)
7. Restore version (verify confirmation dialog)

#### Onboarding

1. Clear all contexts
2. Verify empty state is helpful
3. Click CTA to create first context
4. Complete flow
5. View context details
6. Verify "How to Use" section exists
7. Copy MCP URI
8. Navigate to Settings
9. Verify MCP guide is clear

### Unit Tests (API Keys Only)

- Test key generation produces valid format
- Test key hashing is deterministic
- Test key validation logic
- Test ownership validation

---

## 13. Rollout Plan

1. **Development**: Implement features on local environment
2. **Local Testing**: Complete manual testing checklist
3. **Staging Deploy**: Deploy to Vercel preview environment
4. **Staging Testing**: Verify all features work in production-like environment
5. **Production Deploy**: Deploy to main Vercel project
6. **User Communication**: Announce new features to beta testers
7. **Monitor**: Watch for errors, collect feedback

---

## 14. Future Enhancements (Post-MVP)

- API key scopes and permissions
- API key expiration dates
- Rate limiting per key
- Usage analytics per key
- Welcome modal for first-time users
- Interactive product tour
- Public landing page
- Email notifications for key events
- API key rotation workflow

---

**Document Version**: 1.0  
**Created**: 2026-01-01  
**Owner**: DevContext AI Team  
**Status**: Approved for Implementation
