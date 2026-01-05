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
    description:
      "Explicit context declarations that define what the AI must respect",
    generatePath: (params: ProjectParams) =>
      `/app/projects/${params.projectSlug}/contexts`,
  } satisfies DynamicRoute<ProjectParams>,

  detail: {
    path: "/app/projects/:projectSlug/contexts/:id",
    title: "Context Detail",
    description: "Review explicit context declarations",
    generatePath: (params: ContextParams) =>
      `/app/projects/${params.projectSlug}/contexts/${params.id}`,
  } satisfies DynamicRoute<ContextParams>,

  edit: {
    path: "/app/projects/:projectSlug/contexts/:id/edit",
    title: "Edit Context",
    description: "Modify existing context declarations",
    generatePath: (params: ContextParams) =>
      `/app/projects/${params.projectSlug}/contexts/${params.id}/edit`,
  } satisfies DynamicRoute<ContextParams>,

  composer: {
    path: "/app/projects/:projectSlug/composer",
    title: "Create Context",
    description: "Declare new context for the AI to respect",
    generatePath: (params: ProjectParams) =>
      `/app/projects/${params.projectSlug}/composer`,
  } satisfies DynamicRoute<ProjectParams>,
} as const;
