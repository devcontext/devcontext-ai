import { supabaseAdmin } from "@/lib/supabase/admin";
import { hashAccessToken } from "@/features/access-tokens/services/hash-token";

export type AuthenticatedMcpRequest = {
  userId: string;
  tokenName: string;
};

/**
 * requireAccessToken
 *
 * Validates the x-access-token header and returns the associated userId.
 * Throws an error if invalid.
 */
export async function requireAccessToken(
  request: Request,
): Promise<AuthenticatedMcpRequest> {
  const url = new URL(request.url);
  let accessToken =
    request.headers.get("x-access-token") ||
    url.searchParams.get("x-access-token");

  // Support standard Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (!accessToken && authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  if (!accessToken) {
    throw new Error("Missing Access Token");
  }

  const tokenHash = hashAccessToken(accessToken);

  const { data, error } = await supabaseAdmin
    .from("access_tokens")
    .select("user_id, name, revoked_at, token_hash")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .single();

  if (error || !data) {
    throw new Error("Invalid Access Token");
  }

  return {
    userId: data.user_id,
    tokenName: data.name,
  };
}
