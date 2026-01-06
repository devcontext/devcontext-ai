import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import { ForbiddenError } from "@/features/core/domain/errors";

/**
 * Service to delete a context.
 * Verifies that the context belongs to a project owned by the user.
 */
export async function deleteContext(contextId: string): Promise<void> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    const context = await contextRepo.getContextById(contextId);

    // Verify ownership via project
    const project = await projectRepo.getById(context.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this context",
      );
    }

    await contextRepo.deleteContext(contextId);
  });
}
