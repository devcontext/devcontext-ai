"use server"

import { revalidatePath } from "next/cache"
import { restoreVersion } from "../../core/app/store/restore-version"
import { deleteContext } from "../../core/app/store/delete-context"

export type ActionResponse<T = any> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * restoreVersionAction
 * 
 * Server Action to restore a past version.
 * Revalidates the context detail page after a new version is created.
 */
export async function restoreVersionAction(versionId: string): Promise<ActionResponse> {
  try {
    const result = await restoreVersion(versionId)
    
    if (!result) {
      return { success: false, error: "Failed to restore version" }
    }

    revalidatePath(`/dashboard/contexts/${result.contextId}`)
    return { success: true, data: result }
  } catch (error) {
    console.error("[restoreVersionAction]", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unexpected error during restore" 
    }
  }
}

/**
 * deleteContextAction
 * 
 * Server Action to delete a context.
 * Revalidates the main contexts listing.
 */
export async function deleteContextAction(contextId: string): Promise<ActionResponse> {
  try {
    const success = await deleteContext(contextId)
    
    if (!success) {
      return { success: false, error: "Context not found or failed to delete" }
    }

    revalidatePath("/dashboard/contexts")
    return { success: true }
  } catch (error) {
    console.error("[deleteContextAction]", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unexpected error during deletion" 
    }
  }
}
