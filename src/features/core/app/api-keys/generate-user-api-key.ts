import { generateApiKey } from "../../domain/api-keys/generate-api-key";
import { hashApiKey } from "../../domain/api-keys/hash-api-key";
import { apiKeyRepository } from "../../infra/db/api-key-repository";

export interface GenerateApiKeyResult {
  success: true;
  apiKey: string; // Plain text key - only time it's visible
  keyId: string;
  name: string;
}

export interface GenerateApiKeyError {
  success: false;
  error: string;
}

export type GenerateApiKeyResponse = GenerateApiKeyResult | GenerateApiKeyError;

/**
 * Generates a new API key for a user
 * This is the ONLY place where the plain text key is returned
 * @param userId - The user ID
 * @param name - A descriptive name for the key
 * @returns The generated key and metadata, or an error
 */
export async function generateUserApiKey(
  userId: string,
  name: string,
): Promise<GenerateApiKeyResponse> {
  try {
    // Validate inputs
    if (!userId || !name.trim()) {
      return {
        success: false,
        error: "User ID and name are required",
      };
    }

    // Generate secure random key
    const plainKey = generateApiKey();

    // Hash the key for storage
    const keyHash = hashApiKey(plainKey);

    // Store in database
    const apiKey = await apiKeyRepository.createApiKey({
      userId,
      name: name.trim(),
      keyHash,
    });

    // Return plain key (only time it's visible)
    return {
      success: true,
      apiKey: plainKey,
      keyId: apiKey.id,
      name: apiKey.name,
    };
  } catch (error) {
    console.error("Error generating API key:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate API key",
    };
  }
}
