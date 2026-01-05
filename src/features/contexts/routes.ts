import { DynamicRoute } from "@/features/shared/types/routes";

type ProjectParams = { projectSlug: string };
type ContextParams = ProjectParams & { id: string };

/**
 * Contexts routes - all require projectSlug
 */
export const contextsRoutes = {
  list: {
    path: "/app/projects/:projectSlug/contexts",
    title: "Contexts",
    description: "Manage your AI contexts",
    generatePath: (params: ProjectParams) =>
      `/app/projects/${params.projectSlug}/contexts`,
  } satisfies DynamicRoute<ProjectParams>,

  detail: {
    path: "/app/projects/:projectSlug/contexts/:id",
    title: "Context Detail",
    description: "View context details and version history",
    generatePath: (params: ContextParams) =>
      `/app/projects/${params.projectSlug}/contexts/${params.id}`,
  } satisfies DynamicRoute<ContextParams>,

  edit: {
    path: "/app/projects/:projectSlug/contexts/:id/edit",
    title: "Edit Context",
    description: "Edit an existing context",
    generatePath: (params: ContextParams) =>
      `/app/projects/${params.projectSlug}/contexts/${params.id}/edit`,
  } satisfies DynamicRoute<ContextParams>,

  composer: {
    path: "/app/projects/:projectSlug/composer",
    title: "Create Context",
    description: "Create a new context",
    generatePath: (params: ProjectParams) =>
      `/app/projects/${params.projectSlug}/composer`,
  } satisfies DynamicRoute<ProjectParams>,
} as const;
