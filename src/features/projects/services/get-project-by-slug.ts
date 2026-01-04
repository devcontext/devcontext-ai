import { withAppContext } from "@/features/core/app/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import type { Project } from "@/features/core/domain/types/projects";

/**
 * Service: Get a project by slug
 *
 * Fetches the project by slug scoped to the current user.
 */
export async function getProjectBySlug(slug: string): Promise<Project> {
  return withAppContext(async (ctx) => {
    const repo = new ProjectsRepository(ctx.supabase);
    return repo.getBySlug(slug, ctx.userId);
  });
}
