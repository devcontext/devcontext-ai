import { contextsRepository } from "../../infra/db/contexts-repository"
import { ContextVersion } from "../../domain/types/contexts"

/**
 * restore-version
 * 
 * Logic to restore a past version.
 * Requirement (Locked): Restore = new version.
 * 
 * Creates a NEW version entry copied from the selected one to maintain 
 * a linear history (no pointer rewrites).
 */
export async function restoreVersion(versionId: string): Promise<ContextVersion | null> {
  // 1. Fetch the source version
  const sourceVersion = await contextsRepository.getVersionById(versionId)
  if (!sourceVersion) return null

  // 2. Create a NEW version entry with the same content
  // PRD Decision: Restore creates a new version entry (linear history)
  return await contextsRepository.createContextVersion({
    contextId: sourceVersion.contextId,
    markdown: sourceVersion.markdown,
  })
}
