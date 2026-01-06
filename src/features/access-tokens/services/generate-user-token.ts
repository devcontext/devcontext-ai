import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { generateAccessToken } from "./generate-token";
import { hashAccessToken } from "./hash-token";
import { AccessTokenRepository } from "./token-repository";

export interface GenerateTokenResult {
  success: true;
  accessToken: string; // Plain text token - only time it's visible
  tokenId: string;
  name: string;
}

export interface GenerateTokenError {
  success: false;
  error: string;
}

export type GenerateTokenResponse = GenerateTokenResult | GenerateTokenError;

/**
 * Generates a new access token for a user
 * This is the ONLY place where the plain text token is returned
 * @param supabase - Authenticated Supabase client with user session
 * @param userId - The user ID
 * @param name - A descriptive name for the token
 * @returns The generated token and metadata, or an error
 */
export async function generateUserToken(
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<GenerateTokenResponse> {
  try {
    // Validate inputs
    if (!userId || !name.trim()) {
      return {
        success: false,
        error: "User ID and name are required",
      };
    }

    // Generate secure random token (Entropy generated in service layer)
    const entropy = crypto.randomBytes(32);
    const plainToken = generateAccessToken(entropy);

    // Hash the token for storage
    const tokenHash = hashAccessToken(plainToken);

    // Create repository with authenticated client
    const repository = new AccessTokenRepository(supabase);

    // Store in database
    const token = await repository.createToken({
      userId,
      name: name.trim(),
      tokenHash,
    });

    // Return plain token (only time it's visible)
    return {
      success: true,
      accessToken: plainToken,
      tokenId: token.id,
      name: token.name,
    };
  } catch (error) {
    console.error("Error generating access token:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate access token",
    };
  }
}
