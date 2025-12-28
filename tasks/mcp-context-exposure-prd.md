# PRD — MCP Context Exposure (MVP)

## 1. Introduction / Overview
**MCP Context Exposure** allows external AI tools to consume curated context in a standardized, read-only way.

This layer is **purely consumptive** and does not perform execution, governance, or inference.

---

## 2. Goals
- Expose context via MCP in a predictable way.
- Ensure only the **latest version** is served.
- Guarantee read-only access.

---

## 3. User Stories
- As a developer, I want my AI tools to always receive the latest context.
- As a developer, I want to ensure AI tools cannot modify stored context.

---

## 4. Functional Requirements

### 4.1 Resource Exposure
1. Expose `context://{project-id}`.
2. Return raw markdown of the **Latest ContextVersion**.
3. If multiple contexts exist:
   - Expose the **most recently updated** one (MVP decision).

---

### 4.2 Read-Only Enforcement
- Implement only:
  - `resources/list`
  - `resources/read`
- Do NOT expose:
  - tools
  - mutations
  - execution endpoints

---

### 4.3 Authentication
- Secure access via API Key.
- Validate ownership of the project.

---

## 5. Non-Goals
- Version selection
- Governance enforcement
- Resolver logic
- Write access

---

## 6. Design Considerations
- Raw markdown output
- High availability

---

## 7. Technical Considerations
- Single DB lookup on `ContextVersion`
- Response < 500ms

---

## 8. Success Metrics
- 100% successful reads in supported tools
- Zero unauthorized writes

---

## 9. Edge Cases
- No contexts → return empty resource with guidance message
