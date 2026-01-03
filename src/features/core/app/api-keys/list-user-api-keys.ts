import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiKeyRepository } from "../../infra/db/api-key-repository";
import type { McpKeyListItem } from "../../domain/api-keys/types";

/**
 * Lists all active API keys for a user
 * @param supabase - Authenticated Supabase client with user session
 * @param userId - The user ID
 * @returns Array of API key metadata (no sensitive data)
 */
export async function listUserApiKeys(
  supabase: SupabaseClient,
  userId: string,
): Promise<McpKeyListItem[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const repository = new ApiKeyRepository(supabase);
  return await repository.listUserApiKeys(userId);
}
