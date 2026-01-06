import { type SupabaseClient } from "@supabase/supabase-js";
import { ContextsRepository } from "../../infra/db/contexts-repository";

export type McpResourceContent = {
  uri: string;
  mimeType: string;
  text: string;
};

/**
 * readMcpResource
 *
 * Fetches the raw markdown content of the latest version for a given context.
 * Validates ownership by checking the project owner.
 */
export async function readMcpResource(
  userId: string,
  resourceUri: string,
  supabase: SupabaseClient,
): Promise<{ contents: McpResourceContent[] }> {
  // 1. Extract contextId from URI (context://{id})
  const contextId = resourceUri.replace("context://", "").split("?")[0];

  if (!contextId) {
    throw new Error("Invalid resource URI");
  }

  const repository = new ContextsRepository(supabase);

  // 2. Fetch contexts for user and check if contextId is among them
  // This is a robust way to verify ownership in a single call.
  const contexts = await repository.searchContexts({ userId });
  const context = contexts.find((ctx) => ctx.id === contextId);

  if (!context) {
    throw new Error("Context not found or unauthorized access to resource");
  }

  // 3. Get latest version
  const latestVersion = await repository.getLatestVersion(contextId);
  if (!latestVersion) {
    throw new Error("No versions found for this context");
  }

  return {
    contents: [
      {
        uri: resourceUri,
        mimeType: "text/markdown",
        text: latestVersion.markdown,
      },
    ],
  };
}
