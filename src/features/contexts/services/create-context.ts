import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import {
  type Context,
  type ContextInput,
  type ContextVersion,
} from "@/features/core/domain/types/contexts";
import { ForbiddenError } from "@/features/core/domain/errors";

export interface CreateContextInput extends ContextInput {
  markdown: string;
}

/**
 * Service to create a new context with an initial version.
 * Verifies that the target project is owned by the user.
 */
export async function createContext(
  input: CreateContextInput,
): Promise<Context & { initialVersion: ContextVersion }> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    // Verify project ownership
    const project = await projectRepo.getById(input.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to create a context in this project",
      );
    }

    const context = await contextRepo.createContext({
      projectId: input.projectId,
      name: input.name,
      tags: input.tags,
    });

    const version = await contextRepo.createContextVersion({
      contextId: context.id,
      name: context.name,
      tags: context.tags,
      markdown: input.markdown,
    });

    return {
      ...context,
      initialVersion: version,
    };
  });
}
