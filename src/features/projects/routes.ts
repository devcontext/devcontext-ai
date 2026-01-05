import { BaseRoute, DynamicRoute } from "@/features/shared/types/routes";

type ProjectParams = { projectSlug: string };

/**
 * Projects routes
 */
export const projectsRoutes = {
  list: {
    path: "/app/projects",
    title: "Projects",
    description: "Manage your projects",
  } satisfies BaseRoute,

  detail: {
    path: "/app/projects/:projectSlug",
    title: "Project",
    description: "Project details",
    generatePath: (params: ProjectParams) =>
      `/app/projects/${params.projectSlug}`,
  } satisfies DynamicRoute<ProjectParams>,
} as const;
