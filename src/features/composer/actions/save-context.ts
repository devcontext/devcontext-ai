"use server";

import { saveContextVersion } from "@/features/core/app/composer/save-context-version";

export type SaveContextActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Server Action for saving a context version.
 * Orchestrates the call to the app layer and handles errors for the UI.
 */
export async function saveContextAction(params: {
  contextId?: string;
  name: string;
  markdown: string;
  tags: string[];
  projectId: string;
}): Promise<SaveContextActionResponse> {
  try {
    const result = await saveContextVersion(params);

    if (!result) {
      return { success: false, error: "Failed to save context" };
    }

    return {
      success: true,
      data: {
        context: result.context,
        version: result.version,
      },
    };
  } catch (error) {
    console.error("[saveContextAction]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while saving",
    };
  }
}
