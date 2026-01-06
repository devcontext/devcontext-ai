import type { SupabaseClient } from "@supabase/supabase-js";
import { AccessTokenRepository } from "./token-repository";

export interface RevokeTokenResult {
  success: true;
}

export interface RevokeTokenError {
  success: false;
  error: string;
}

export type RevokeTokenResponse = RevokeTokenResult | RevokeTokenError;

/**
 * Revokes an access token (soft delete)
 * Validates ownership before revoking
 * @param supabase - Authenticated Supabase client with user session
 * @param tokenId - The access token ID to revoke
 * @param userId - The user ID (for ownership validation)
 * @returns Success or error response
 */
export async function revokeUserToken(
  supabase: SupabaseClient,
  tokenId: string,
  userId: string,
): Promise<RevokeTokenResponse> {
  try {
    if (!tokenId || !userId) {
      return {
        success: false,
        error: "Token ID and user ID are required",
      };
    }

    const repository = new AccessTokenRepository(supabase);
    // Repository method validates ownership via RLS
    await repository.revokeToken(tokenId, userId);

    return { success: true };
  } catch (error) {
    console.error("Error revoking access token:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to revoke access token",
    };
  }
}
