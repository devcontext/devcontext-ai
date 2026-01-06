import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import {
  type Context,
  type ContextVersion,
} from "@/features/core/domain/types/contexts";
import { ForbiddenError } from "@/features/core/domain/errors";

export interface UpdateContextInput {
  contextId: string;
  name: string;
  tags: string[];
  markdown: string;
}

/**
 * Service to update a context's metadata and create a new version.
 * Verifies ownership of the context before updating.
 */
export async function updateContext(
  input: UpdateContextInput,
): Promise<Context & { newVersion: ContextVersion }> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    // Get existing context
    const existingContext = await contextRepo.getContextById(input.contextId);

    // Verify ownership via project
    const project = await projectRepo.getById(existingContext.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to modify this context",
      );
    }

    // Update context metadata (name, tags)
    const updatedContext = await contextRepo.updateContext(input.contextId, {
      name: input.name,
      tags: input.tags,
    });

    // Create new version with the markdown content and metadata
    const newVersion = await contextRepo.createContextVersion({
      contextId: input.contextId,
      name: input.name,
      tags: input.tags,
      markdown: input.markdown,
    });

    return {
      ...updatedContext,
      newVersion,
    };
  });
}
