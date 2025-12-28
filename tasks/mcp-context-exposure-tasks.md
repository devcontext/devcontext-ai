## Relevant Files

- `src/features/shared/lib/mcp-auth.ts` - Helper for API Key validation. [NEW]
- `src/features/core/app/mcp/list-mcp-resources.ts` - Use case for listing contexts. [NEW]
- `src/features/core/app/mcp/read-mcp-resource.ts` - Use case for reading the latest version markdown. [NEW]
- `src/features/core/infra/db/context-repository.ts` - Data access for listing and versions. [MODIFY]
- `src/app/api/mcp/resources/route.ts` - MCP endpoint for `resources/list`. [NEW]
- `src/app/api/mcp/resources/[...path]/route.ts` - MCP endpoint for `resources/read`. [NEW]

### Notes

- **Read-Only**: Prohibido mutations y tools.
- **Latest Only**: Devuelve solo el Markdown de la última versión.
- **URI Format**: `context://{id}`.
- **Auth**: Validar `x-api-key` y ownership.
- **Output**: Markdown crudo para el `read`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`.

## Tasks

- [x] 0.0 Create feature branch
- [x] 0.1 Create and checkout `feature/mcp-resources`
- [x] 1.0 Auth Implementation
- [x] 1.1 Create `src/features/shared/lib/mcp-auth.ts` with `requireApiKey(request)`
- [x] 2.0 Listing Implementation
- [x] 2.1 Implement `src/features/core/app/mcp/list-mcp-resources.ts`
- [x] 2.2 Create `src/app/api/mcp/resources/route.ts` for MCP resource listing
- [x] 3.0 Read Implementation
- [x] 3.1 Implement `src/features/core/app/mcp/read-mcp-resource.ts`
- [x] 3.2 Create `src/app/api/mcp/resources/[...path]/route.ts` for raw markdown exposure
- [x] 4.0 Infrastructure & Persistence
- [x] 4.1 Update `src/features/core/infra/db/context-repository.ts` if needed (listing + latest version)
- [x] 5.0 Verification & Security
- [x] 5.1 Verify ownership filters in list and read
- [x] 5.2 Test with `curl` using the `x-api-key` header
- [x] 5.3 Confirm NO tools or mutations are exposed
