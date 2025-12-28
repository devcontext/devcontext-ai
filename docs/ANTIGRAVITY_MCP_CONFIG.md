# Antigravity MCP Configuration Guide

## 📝 Configuration for Antigravity IDE

Antigravity (Google Gemini Code Assist) uses a specific format for MCP server configuration via HTTP transport.

---

## Configuration File Location

**File**: `~/.gemini/antigravity/mcp_config.json`

---

## Correct Configuration Format

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "serverUrl": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

---

## Key Differences from Other Clients

| Property               | Antigravity   | Cursor/Claude Desktop |
| ---------------------- | ------------- | --------------------- |
| **URL Property**       | `serverUrl`   | `url`                 |
| **Transport Property** | ❌ Not needed | `"transport": "http"` |
| **Format**             | Simplified    | Explicit              |

> [!IMPORTANT]
> Antigravity uses `serverUrl` instead of `url` + `transport` properties

---

## Complete Example

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "serverUrl": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer sk_abc123_your_actual_key_here"
      },
      "description": "DevContext AI - AI Context Control Plane"
    }
  }
}
```

---

## How to Apply

1. **Edit the config file**:

   ```bash
   nano ~/.gemini/antigravity/mcp_config.json
   ```

2. **Add the configuration** above

3. **Replace** `YOUR_API_KEY_HERE` with your actual API key

4. **Reload** Antigravity or restart the IDE

---

## Verification

After configuration, Antigravity should:

- ✅ Show DevContext AI in the MCP servers list
- ✅ Allow you to call the `execute_project_context` tool
- ✅ List available resources via `context://` URIs

---

## Troubleshooting

### Server not appearing

**Check**:

1. JSON syntax is valid (use `jq` to validate)
2. File is in correct location: `~/.gemini/antigravity/mcp_config.json`
3. API key is correct and active

**Validate JSON**:

```bash
jq . ~/.gemini/antigravity/mcp_config.json
```

### Authentication errors

**Verify API key**:

1. Check key exists in Supabase `api_keys` table
2. Ensure it's not expired or revoked
3. Test with curl:
   ```bash
   curl -X POST https://dev-context-ai.vercel.app/api/mcp/http \
     -H "Authorization: Bearer YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

---

## Alternative: Project-Specific Configuration

For project-specific MCP servers, use `.gemini/settings.json` in your project root:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "serverUrl": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

This config applies only when working in that specific project.
