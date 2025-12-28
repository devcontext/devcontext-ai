import { contextsRepository } from "../../infra/db/contexts-repository";

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
): Promise<{ contents: McpResourceContent[] }> {
  // 1. Extract contextId from URI (context://{id})
  const contextId = resourceUri.replace("context://", "").split("?")[0];

  if (!contextId) {
    throw new Error("Invalid resource URI");
  }

  // 2. Fetch context to verify ownership
  const context = await contextsRepository.getContextById(contextId);
  if (!context) {
    throw new Error("Context not found");
  }

  // Double check ownership (infra join check in repository would be better,
  // but for now we have getContextById which returns the context object).
  // We need to verify if this project belongs to the user.
  // getContextById doesn't return the owner_user_id directly, but it has projectId.

  const contextsForUser = await contextsRepository.getContextsByUserId(userId);
  const isOwner = contextsForUser.some((c) => c.id === contextId);

  if (!isOwner) {
    throw new Error("Unauthorized access to resource");
  }

  // 3. Get latest version
  const latestVersion = await contextsRepository.getLatestVersion(contextId);
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
