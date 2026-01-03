import { hashApiKey } from "../../domain/api-keys/hash-api-key";
import { validateApiKeyFormat } from "../../domain/api-keys/validate-api-key-format";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiKeyRepository } from "../../infra/db/api-key-repository";

/**
 * Validates an API key and returns the associated user ID
 * @param supabase - Supabase client (can be unauthenticated for this operation)
 * @param apiKey - The plain text API key to validate
 * @returns The user ID if valid, null otherwise
 */
export async function validateApiKey(
  supabase: SupabaseClient,
  apiKey: string,
): Promise<string | null> {
  try {
    // Hash the provided key
    const keyHash = hashApiKey(apiKey);

    // Look up the key in the database
    const repository = new ApiKeyRepository(supabase);
    const apiKeyRecord = await repository.findByKeyHash(keyHash);

    if (!apiKeyRecord) {
      return null;
    }

    // Update last used timestamp (fire and forget)
    repository.updateLastUsed(apiKeyRecord.id).catch((err: Error) => {
      console.error("Failed to update last_used_at:", err.message);
    });

    return apiKeyRecord.userId;
  } catch (error) {
    console.error("Error validating API key:", error);
    return null;
  }
}
