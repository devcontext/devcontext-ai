# 🚀 Quick Start: Migrating to HTTP Transport

If you're experiencing MCP connection errors, follow these steps:

## 1. Update Your MCP Client Config

### For Cursor

Open your MCP settings and change:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "transport": "http",
      "url": "https://dev-context-ai.vercel.app/api/mcp/http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### For Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "devcontext-ai": {
      "url": "https://dev-context-ai.vercel.app/api/mcp/http",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## 2. Restart Your MCP Client

- **Cursor**: Reload window or restart app
- **Claude Desktop**: Quit and reopen

## 3. Verify Connection

In your MCP client, check that the DevContext AI server appears as connected.

---

## Need Help?

See full documentation: [`docs/MCP_CLIENT_CONFIGURATION.md`](./MCP_CLIENT_CONFIGURATION.md)
