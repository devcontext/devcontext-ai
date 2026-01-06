import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import { type ContextVersion } from "@/features/core/domain/types/contexts";
import { ForbiddenError } from "@/features/core/domain/errors";

/**
 * Service to restore a past version of a context.
 * Requirement (Locked): Restore = new version.
 * Creates a NEW version entry copied from the selected one to maintain a linear history.
 * Verifies ownership of the parent context.
 */
export async function restoreVersion(
  versionId: string,
): Promise<ContextVersion> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    const sourceVersion = await contextRepo.getVersionById(versionId);
    const context = await contextRepo.getContextById(sourceVersion.contextId);

    // Verify ownership via project
    const project = await projectRepo.getById(context.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to modify this context",
      );
    }

    // 1. Sync the parent context metadata if the version has it
    // If name/tags are null (old versions), we keep the current ones
    if (sourceVersion.name || sourceVersion.tags) {
      await contextRepo.updateContext(sourceVersion.contextId, {
        name: sourceVersion.name ?? context.name,
        tags: sourceVersion.tags ?? context.tags,
      });
    }

    // 2. PRD Decision: Restore creates a new version entry (linear history)
    return contextRepo.createContextVersion({
      contextId: sourceVersion.contextId,
      name: sourceVersion.name ?? context.name,
      tags: sourceVersion.tags ?? context.tags,
      markdown: sourceVersion.markdown,
    });
  });
}
