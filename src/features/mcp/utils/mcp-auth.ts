import { supabaseAdmin } from "@/lib/supabase/admin";
import { hashAccessTokenHmac } from "@/features/access-tokens/utils/token-crypto";
import { AccessTokenRepository } from "@/features/core/infra/db/access-tokens-repository";

export type AuthenticatedMcpRequest = {
  userId: string;
  tokenName: string;
};

/**
 * requireAccessToken
 *
 * Validates the access token from request headers and returns the associated userId.
 *
 * Supported headers (in order of preference):
 * 1. Authorization: Bearer <token> (PREFERRED)
 * 2. x-access-token (legacy fallback)
 *
 * @throws Error if token is missing or invalid
 */
export async function requireAccessToken(
  request: Request,
): Promise<AuthenticatedMcpRequest> {
  const url = new URL(request.url);

  // Prefer Authorization: Bearer header
  const authHeader = request.headers.get("authorization");
  let accessToken: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  // Fallback to x-access-token (legacy)
  if (!accessToken) {
    accessToken =
      request.headers.get("x-access-token") ||
      url.searchParams.get("x-access-token");
  }

  if (!accessToken) {
    throw new Error("Missing Access Token");
  }

  // Hash using HMAC-SHA256 with server secret
  const tokenHash = hashAccessTokenHmac(accessToken);

  // Use Repository for abstraction
  const repository = new AccessTokenRepository(supabaseAdmin);
  const tokenRecord = await repository.findByTokenHash(tokenHash);

  if (!tokenRecord) {
    throw new Error("Invalid Access Token");
  }

  // Update last_used_at (fire and forget for MVP)
  repository.updateLastUsed(tokenRecord.id).catch((err: Error) => {
    console.error("Failed to update last_used_at:", err.message);
  });

  return {
    userId: tokenRecord.userId,
    tokenName: tokenRecord.name,
  };
}
