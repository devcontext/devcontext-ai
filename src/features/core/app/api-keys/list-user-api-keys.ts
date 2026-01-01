import { apiKeyRepository } from "../../infra/db/api-key-repository";
import type { ApiKeyListItem } from "../../domain/api-keys/types";

/**
 * Lists all active API keys for a user
 * @param userId - The user ID
 * @returns Array of API key metadata (no sensitive data)
 */
export async function listUserApiKeys(
  userId: string,
): Promise<ApiKeyListItem[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await apiKeyRepository.listUserApiKeys(userId);
}
