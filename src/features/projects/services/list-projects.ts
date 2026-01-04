import { withAppContext } from "@/features/core/app/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import { Project } from "@/features/core/domain/types/projects";

/**
 * Service: List all projects for the authenticated user
 *
 * DATA FETCHING PATTERN (Rule #11-12):
 * - Service encapsulates withAppContext internally
 * - Actions don't need to know about context/auth
 * - Service creates repository with shared Supabase client
 */
export async function listProjects(): Promise<Project[]> {
  return withAppContext(async (ctx) => {
    const repo = new ProjectsRepository(ctx.supabase);
    return repo.getByOwnerId(ctx.userId);
  });
}
