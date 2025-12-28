# Testing MCP HTTP Endpoint After basePath Fix

## Test Commands

After deploying the fix, run these commands to verify:

### 1. Test Basic Endpoint

```bash
curl https://dev-context-ai.vercel.app/api/mcp/http
```

**Expected**: Should return MCP protocol response (not 404)

### 2. Test with Authorization

```bash
curl -X POST https://dev-context-ai.vercel.app/api/mcp/http \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

**Expected**: List of available tools

### 3. Test from Antigravity

Update `~/.gemini/antigravity/mcp_config.json`:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "serverUrl": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Restart Antigravity and verify the server connects.

---

## What Changed

**Before**:

```typescript
createMcpHandler(
  (server) => {
    /* ... */
  },
  {
    serverInfo: {
      /* ... */
    },
  },
  { basePath: "/api/mcp", verboseLogs: true }, // ❌ Conflicted with Next.js routing
);
```

**After**:

```typescript
createMcpHandler(
  (server) => {
    /* ... */
  },
  {
    serverInfo: {
      /* ... */
    },
  },
  { verboseLogs: true }, // ✅ Let Next.js handle the full path
);
```

---

## Why This Fixes the Problem

1. **File location**: `/api/mcp/[transport]/route.ts`
2. **Next.js routing**: Automatically handles `/api/mcp/http`, `/api/mcp/sse`, etc.
3. **basePath conflict**: Handler was expecting `/api/mcp` as base, but Next.js already provides the full `/api/mcp/[transport]` path
4. **Result**: Removing `basePath` lets Next.js routing work correctly
