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

  apiKeys: {
    path: "/app/settings/api-keys",
    title: "API Keys",
    description: "Manage your API keys",
  } satisfies BaseRoute,
} as const;
