import { contextsRepository } from "../../infra/db/contexts-repository"
import { Context, ContextVersion } from "../../domain/types/contexts"

export type ContextDetails = {
  context: Context
  versions: ContextVersion[]
}

/**
 * get-context-details
 * 
 * Fetches a single context and all its versions, ordered DESC by creation.
 */
export async function getContextDetails(id: string): Promise<ContextDetails | null> {
  const context = await contextsRepository.getContextById(id)
  if (!context) return null

  const versions = await contextsRepository.getVersionsByContextId(id)

  return {
    context,
    versions,
  }
}
