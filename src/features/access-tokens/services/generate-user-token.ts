import {
  generateAccessTokenPlain,
  hashAccessTokenHmac,
} from "../utils/token-crypto";
import { AccessTokenRepository } from "@/features/core/infra/db/access-tokens-repository";
import { withAppContext } from "@/features/core/app/context/app-context";
import { ValidationError } from "@/features/core/domain/errors";

export interface GenerateTokenResult {
  accessToken: string; // Plain text token - only time it's visible
  tokenId: string;
  name: string;
}

/**
 * Generates a new access token for a user
 * This is the ONLY place where the plain text token is returned
 *
 * SECURITY NOTES:
 * - Token is generated with CSPRNG (32 bytes)
 * - Only the HMAC-SHA256 hash is stored in DB
 * - Plain token is returned ONCE and never logged
 *
 * @param name - A descriptive name for the token
 * @returns The generated token and metadata
 * @throws {ValidationError} If name is missing
 * @throws {UnexpectedError} If database operation fails
 */
export async function generateUserToken(
  name: string,
): Promise<GenerateTokenResult> {
  return withAppContext(async ({ supabase, userId }) => {
    // Validate inputs
    if (!name.trim()) {
      throw new ValidationError("Access token name is required", "name");
    }

    // Generate secure random token (CSPRNG internally)
    const plainToken = generateAccessTokenPlain();

    // Hash the token with HMAC-SHA256 for storage
    const tokenHash = hashAccessTokenHmac(plainToken);

    // Create repository with authenticated client
    const repository = new AccessTokenRepository(supabase);

    // Store in database (only hash, never plain token)
    const token = await repository.createToken({
      userId,
      name: name.trim(),
      tokenHash,
    });

    // Return plain token (only time it's visible - NEVER logged)
    return {
      accessToken: plainToken,
      tokenId: token.id,
      name: token.name,
    };
  });
}
