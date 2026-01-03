import { BaseRoute } from "@/features/shared/types/routes";

const basePath = "/dashboard/settings/api-keys";

export const mcpKeysRoutes = {
  root: {
    path: basePath,
    title: "MCP Keys",
    description: "Manage your MCP keys",
  } as BaseRoute,
};
