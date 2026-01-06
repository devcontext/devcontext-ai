import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import {
  type ContextVersion,
  type ContextVersionInput,
} from "@/features/core/domain/types/contexts";
import { ForbiddenError } from "@/features/core/domain/errors";

/**
 * Service to save a new version of a context.
 * Verifies ownership of the parent context.
 */
export async function saveVersion(
  input: ContextVersionInput,
): Promise<ContextVersion> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    const context = await contextRepo.getContextById(input.contextId);

    // Verify ownership via project
    const project = await projectRepo.getById(context.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to modify this context",
      );
    }

    return contextRepo.createContextVersion(input);
  });
}
