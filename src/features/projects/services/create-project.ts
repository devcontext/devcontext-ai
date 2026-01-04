import { withAppContext } from "@/features/core/app/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import { Project, ProjectInput } from "@/features/core/domain/types/projects";

/**
 * Service: Create a new project
 *
 * DATA FETCHING PATTERN (Rule #11-12):
 * - Service encapsulates withAppContext internally
 * - Receives project data WITHOUT ownerUserId (auto-injected from context)
 * - Service creates repository with shared Supabase client
 */
export async function createProject(
  input: Omit<ProjectInput, "ownerUserId">,
): Promise<Project> {
  return withAppContext(async (ctx) => {
    const repo = new ProjectsRepository(ctx.supabase);

    return repo.create({
      ...input,
      ownerUserId: ctx.userId,
    });
  });
}
