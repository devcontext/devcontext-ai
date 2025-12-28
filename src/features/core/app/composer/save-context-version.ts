import { contextsRepository } from "../../infra/db/contexts-repository"
import { projectsRepository } from "../../infra/db/projects-repository"
import type { Context, ContextVersion, ContextInput, ContextVersionInput } from "../../domain/types/contexts"

export type SaveContextVersionInput = {
  contextId?: string
  name: string
  markdown: string
  tags: string[]
  projectId: string
}

export type SaveContextVersionResult = {
  context: Context
  version: ContextVersion
}

/**
 * Saves a context version.
 * - If contextId is provided, creates a new version for existing context.
 * - If contextId is not provided, creates a new context and its first version.
 */
export async function saveContextVersion(
  input: SaveContextVersionInput
): Promise<SaveContextVersionResult | null> {
  // 1. Verify project exists
  const project = await projectsRepository.getById(input.projectId)
  if (!project) {
    throw new Error(`Project with ID ${input.projectId} not found. Persistence requires a valid project.`)
  }

  let context: Context | null

  if (input.contextId) {
    // Update existing context's tags if provided
    context = await contextsRepository.updateContext(input.contextId, {
      tags: input.tags,
    })
  } else {
    // Create new context
    const contextInput: ContextInput = {
      projectId: input.projectId,
      name: input.name,
      tags: input.tags,
    }
    context = await contextsRepository.createContext(contextInput)
  }

  if (!context) {
    return null
  }

  // Create new version
  const versionInput: ContextVersionInput = {
    contextId: context.id,
    markdown: input.markdown,
  }

  const version = await contextsRepository.createContextVersion(versionInput)

  if (!version) {
    return null
  }

  return { context, version }
}
