import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { generateApiKey } from "../../domain/api-keys/generate-api-key";
import { hashApiKey } from "../../domain/api-keys/hash-api-key";
import { ApiKeyRepository } from "../../infra/db/api-key-repository";

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
 * @param supabase - Authenticated Supabase client with user session
 * @param userId - The user ID
 * @param name - A descriptive name for the key
 * @returns The generated key and metadata, or an error
 */
export async function generateUserApiKey(
  supabase: SupabaseClient,
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

    // Generate secure random key (Entropy generated in App layer)
    const entropy = crypto.randomBytes(32);
    const plainKey = generateApiKey(entropy);

    // Hash the key for storage
    const keyHash = hashApiKey(plainKey);

    // Create repository with authenticated client
    const repository = new ApiKeyRepository(supabase);

    // Store in database
    const apiKey = await repository.createApiKey({
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
