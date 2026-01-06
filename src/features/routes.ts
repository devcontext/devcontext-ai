import { BaseRoute } from "@/features/shared/types/routes";
import { authRoutes } from "./auth/routes";
import { projectsRoutes } from "./projects/routes";
import { contextsRoutes } from "./contexts/routes";
import { settingsRoutes } from "./settings/routes";

/**
 * Global route aggregator
 *
 * All application routes are exposed through this single object.
 * Routes are organized by feature namespace.
 *
 * @example
 * // Static route
 * appRoutes.home.path // => "/app"
 *
 * // Dynamic route
 * appRoutes.contexts.list.generatePath({ projectSlug: "my-project" })
 * // => "/app/projects/my-project/contexts"
 */
export const appRoutes = {
  /** Home/Overview page */
  home: {
    path: "/app",
    title: "Overview",
    description: "Your AI Context Control Plane at a glance",
  } satisfies BaseRoute,

  /** Authentication routes */
  auth: authRoutes,

  /** Projects management routes */
  projects: projectsRoutes,

  /** Contexts management routes */
  contexts: contextsRoutes,

  /** Settings routes */
  settings: settingsRoutes,
} as const;
