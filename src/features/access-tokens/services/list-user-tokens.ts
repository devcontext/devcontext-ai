import type { SupabaseClient } from "@supabase/supabase-js";
import { AccessTokenRepository } from "./token-repository";
import type { AccessTokenListItem } from "../types";

/**
 * Lists all active access tokens for a user
 * @param supabase - Authenticated Supabase client with user session
 * @param userId - The user ID
 * @returns Array of access token metadata (no sensitive data)
 */
export async function listUserTokens(
  supabase: SupabaseClient,
  userId: string,
): Promise<AccessTokenListItem[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const repository = new AccessTokenRepository(supabase);
  return await repository.listUserTokens(userId);
}
