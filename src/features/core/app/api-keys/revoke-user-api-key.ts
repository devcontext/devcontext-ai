import { apiKeyRepository } from "../../infra/db/api-key-repository";

export interface RevokeApiKeyResult {
  success: true;
}

export interface RevokeApiKeyError {
  success: false;
  error: string;
}

export type RevokeApiKeyResponse = RevokeApiKeyResult | RevokeApiKeyError;

/**
 * Revokes an API key (soft delete)
 * Validates ownership before revoking
 * @param keyId - The API key ID to revoke
 * @param userId - The user ID (for ownership validation)
 * @returns Success or error response
 */
export async function revokeUserApiKey(
  keyId: string,
  userId: string,
): Promise<RevokeApiKeyResponse> {
  try {
    if (!keyId || !userId) {
      return {
        success: false,
        error: "Key ID and user ID are required",
      };
    }

    // Repository method validates ownership via RLS
    await apiKeyRepository.revokeApiKey(keyId, userId);

    return { success: true };
  } catch (error) {
    console.error("Error revoking API key:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke API key",
    };
  }
}
