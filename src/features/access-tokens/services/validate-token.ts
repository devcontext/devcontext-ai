import { hashAccessToken } from "./hash-token";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AccessTokenRepository } from "./token-repository";

/**
 * Validates an access token and returns the associated user ID
 * @param supabase - Supabase client (can be unauthenticated for this operation)
 * @param token - The plain text access token to validate
 * @returns The user ID if valid, null otherwise
 */
export async function validateAccessToken(
  supabase: SupabaseClient,
  token: string,
): Promise<string | null> {
  try {
    // Hash the provided token
    const tokenHash = hashAccessToken(token);

    // Look up the token in the database
    const repository = new AccessTokenRepository(supabase);
    const tokenRecord = await repository.findByTokenHash(tokenHash);

    if (!tokenRecord) {
      return null;
    }

    // Update last used timestamp (fire and forget)
    repository.updateLastUsed(tokenRecord.id).catch((err: Error) => {
      console.error("Failed to update last_used_at:", err.message);
    });

    return tokenRecord.userId;
  } catch (error) {
    console.error("Error validating access token:", error);
    return null;
  }
}
