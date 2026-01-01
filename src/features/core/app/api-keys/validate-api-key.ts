import { hashApiKey } from "../../domain/api-keys/hash-api-key";
import { validateApiKeyFormat } from "../../domain/api-keys/validate-api-key-format";
import { apiKeyRepository } from "../../infra/db/api-key-repository";
import type { ApiKey } from "../../domain/api-keys/types";

/**
 * Validates an API key and updates its last_used_at timestamp
 * @param plainKey - The plain text API key to validate
 * @returns The API key record if valid, null otherwise
 */
export async function validateApiKey(plainKey: string): Promise<ApiKey | null> {
  // First validate format
  if (!validateApiKeyFormat(plainKey)) {
    return null;
  }

  // Hash the key
  const keyHash = hashApiKey(plainKey);

  // Find in database
  const apiKey = await apiKeyRepository.findByKeyHash(keyHash);

  if (!apiKey) {
    return null;
  }

  // Update last used timestamp (fire and forget)
  apiKeyRepository.updateLastUsed(apiKey.id).catch((err) => {
    console.error("Failed to update last_used_at:", err);
  });

  return apiKey;
}
