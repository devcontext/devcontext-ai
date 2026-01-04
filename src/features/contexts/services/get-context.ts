import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import {
  type Context,
  type ContextVersion,
} from "@/features/core/domain/types/contexts";
import { type Project } from "@/features/core/domain/types/projects";
import { ForbiddenError } from "@/features/core/domain/errors";

export interface ContextDetails extends Context {
  versions: ContextVersion[];
  latestVersion: ContextVersion;
  project: Project;
}

/**
 * Service to get a single context with its details (versions).
 * Verifies that the context belongs to a project owned by the user.
 */
export async function getContext(contextId: string): Promise<ContextDetails> {
  return withAppContext(async ({ supabase, userId }) => {
    const contextRepo = new ContextsRepository(supabase);
    const projectRepo = new ProjectsRepository(supabase);

    const context = await contextRepo.getContextById(contextId);

    // Verify ownership via project
    const project = await projectRepo.getById(context.projectId);
    if (project.ownerUserId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to access this context",
      );
    }

    const versions = await contextRepo.getVersionsByContextId(contextId);
    const latestVersion = await contextRepo.getLatestVersion(contextId);

    return {
      ...context,
      versions,
      latestVersion,
      project,
    };
  });
}
