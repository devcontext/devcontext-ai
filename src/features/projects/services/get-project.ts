import { withAppContext } from "@/features/core/app/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import { Project } from "@/features/core/domain/types/projects";

/**
 * Service: Get a single project by ID with ownership verification
 *
 * DATA FETCHING PATTERN (Rule #11-12):
 * - Service encapsulates withAppContext internally
 * - Verifies ownership before returning
 * - Service creates repository with shared Supabase client
 */
export async function getProject(projectId: string): Promise<Project> {
  return withAppContext(async (ctx) => {
    const repo = new ProjectsRepository(ctx.supabase);
    return repo.getById(projectId);
  });
}
