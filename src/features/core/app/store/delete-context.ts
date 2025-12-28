import { contextsRepository } from "../../infra/db/contexts-repository"

/**
 * delete-context
 * 
 * Logic to delete a context and all its versions.
 * PRD Decision: Deletes the context and all versions after confirmation.
 * DB handles cascade delete if schema is configured correctly.
 */
export async function deleteContext(id: string): Promise<boolean> {
  const context = await contextsRepository.getContextById(id)
  if (!context) return false

  await contextsRepository.deleteContext(id)
  return true
}
