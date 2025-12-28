# MCP Client Configuration Guide

## 🔧 Configuration for HTTP Transport (Recommended)

The DevContext AI MCP server is deployed on Vercel and **optimized for HTTP transport**. Use the following configuration for your MCP client:

---

## Cursor Configuration

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "transport": "http",
      "url": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

**To configure:**

1. Open Cursor Settings
2. Navigate to **Features** → **Model Context Protocol**
3. Add the server configuration above
4. Replace `YOUR_API_KEY_HERE` with your actual API key

---

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "url": "https://dev-context-ai.vercel.app/api/mcp/http",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

---

## Environment Variables

The MCP server requires the following environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: For logging/debugging
NODE_ENV=production
```

---

## Testing the Connection

### 1. Test Server Health

```bash
curl https://dev-context-ai.vercel.app/api/mcp
```

Expected response:

```json
{
  "status": "ok",
  "message": "DevContext AI MCP Server is running.",
  "endpoints": {
    "sse": "/api/mcp/sse",
    "http": "/api/mcp/http",
    "config": "/.well-known/mcp-configuration"
  }
}
```

### 2. Test Authentication

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

Expected response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "execute_project_context",
        "description": "Resolves project context and returns a specialized prompt/contract for AI agents.",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### 3. Test Resources

```bash
curl -X POST https://dev-context-ai.vercel.app/api/mcp/http \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/list"
  }'
```

---

## Why HTTP Instead of SSE?

| Feature                        | HTTP                | SSE                                |
| ------------------------------ | ------------------- | ---------------------------------- |
| **Vercel Compatibility**       | ✅ Excellent        | ⚠️ Limited                         |
| **Timeout Handling**           | ✅ Request/Response | ❌ Requires persistent connection  |
| **CDN Support**                | ✅ Full support     | ⚠️ Often blocked                   |
| **Implementation Complexity**  | ✅ Simple           | ❌ Requires Redis/state management |
| **Recommended for Production** | ✅ Yes              | ❌ Use dedicated server instead    |

---

## Troubleshooting

### Error: "Rejected SSE connection with method POST"

**Cause**: Client is configured for SSE but server rejects POST/DELETE on SSE endpoint.

**Solution**: Change `transport` to `"http"` in client configuration.

### Error: "504 Gateway Timeout"

**Cause**: SSE connection exceeds Vercel function timeout.

**Solution**: Use HTTP transport instead of SSE.

### Error: "Invalid API Key"

**Cause**: Missing or incorrect API key in request headers.

**Solution**:

1. Verify API key exists in Supabase `api_keys` table
2. Ensure header is: `Authorization: Bearer YOUR_KEY`
3. Check for typos in the key

---

## API Key Management

Generate a new API key via the DevContext AI dashboard:

1. Navigate to **Settings** → **API Keys**
2. Click **Generate New Key**
3. Copy the key (it won't be shown again)
4. Add to your MCP client configuration

---

## Production Deployment Notes

For production deployments:

- Use environment-specific API keys (dev, staging, prod)
- Enable CORS if accessing from web clients
- Monitor Vercel function execution times
- Set up error tracking (e.g., Sentry)
- Consider rate limiting for public endpoints
