import { protectedResourceHandler } from "mcp-handler";

/**
 * MCP Discovery Endpoint (RFC 9728)
 *
 * Provides OAuth 2.0 Protected Resource Metadata so MCP clients
 * can discover how to authorize with this server.
 *
 * This route is mapped from /.well-known/mcp-configuration via next.config.ts
 */
export const GET = protectedResourceHandler({
  authServerUrls: [
    process.env.NEXT_PUBLIC_SITE_URL || "https://devcontextai.vercel.app",
  ],
});
