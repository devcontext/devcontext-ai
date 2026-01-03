import { BaseRoute } from "@/features/shared/types/routes";
import { mcpKeysRoutes } from "./mcp-keys/routes";

const basePath = "/dashboard/settings";

interface RouteParams {
  id: string;
  teamId?: string;
  slug: string;
}

/**
 * Rutas de jugadores con patrón multi-club usando clubId directamente
 */
export const settingsRoutes = {
  general: {
    path: basePath,
    title: "Settings",
    description: "Manage your settings",
  } as BaseRoute,

  // KEYS
  mcpKeys: mcpKeysRoutes,
};
