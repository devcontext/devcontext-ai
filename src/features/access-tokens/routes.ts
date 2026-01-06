import { BaseRoute } from "@/features/shared/types/routes";

/**
 * Access Tokens routes
 */
export const accessTokensRoutes = {
  root: {
    path: "/app/settings/access-tokens",
    title: "Access Tokens",
    description: "Tokens to access contexts via MCP",
  } satisfies BaseRoute,
} as const;
