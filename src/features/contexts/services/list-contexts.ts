import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import { type Context } from "@/features/core/domain/types/contexts";

export interface ListContextsFilters {
  projectId?: string;
  search?: string;
  tags?: string[];
}

/**
 * Service to list contexts for a specific project or user.
 * Supports filtering by project, search terms, and tags.
 */
export async function listContexts(
  filters?: ListContextsFilters,
): Promise<Context[]> {
  return withAppContext(async ({ supabase, userId }) => {
    const repository = new ContextsRepository(supabase);

    return repository.searchContexts({
      userId,
      projectId: filters?.projectId,
      search: filters?.search,
      tags: filters?.tags,
    });
  });
}
