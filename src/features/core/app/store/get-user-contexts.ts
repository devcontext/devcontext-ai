import { contextsRepository } from "../../infra/db/contexts-repository"
import { Context } from "../../domain/types/contexts"

export type GetUserContextsFilters = {
  projectId?: string
  tags?: string[]
  search?: string
}

/**
 * get-user-contexts
 * 
 * Fetches contexts owned by the user with optional filters.
 * Note: Real owner filtering is handled by RLS, but in dev we 
 * might need to filter by projectId explicitly if RLS is disabled.
 */
export async function getUserContexts(filters: GetUserContextsFilters = {}): Promise<Context[]> {
  // 1. Fetch contexts (filtered by projectId if provided, otherwise all user contexts)
  let contexts = filters.projectId 
    ? await contextsRepository.getContextsByProjectId(filters.projectId)
    : await contextsRepository.getAllContexts()
  
  // 2. Client-side filtering for MVP (Search by name and Tags)
  if (filters.search) {
    const search = filters.search.toLowerCase()
    contexts = contexts.filter(c => c.name.toLowerCase().includes(search))
  }
  
  if (filters.tags && filters.tags.length > 0) {
    contexts = contexts.filter(c => 
      filters.tags!.every(t => c.tags.includes(t))
    )
  }
  
  return contexts
}
