import { BaseRoute } from "@/features/shared/types/routes";

/**
 * Settings routes
 */
export const settingsRoutes = {
  root: {
    path: "/app/settings",
    title: "Settings",
    description: "Manage your settings",
  } satisfies BaseRoute,

  accessTokens: {
    path: "/app/settings/access-tokens",
    title: "Access Tokens",
    description: "Manage your MCP access tokens",
  } satisfies BaseRoute,

  mcpIntegration: {
    path: "/app/settings/mcp-integration",
    title: "MCP Integration",
    description: "Connect your IDE to DevContext AI",
  } satisfies BaseRoute,
} as const;
