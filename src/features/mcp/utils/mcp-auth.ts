import { supabaseAdmin } from "@/lib/supabase/admin";
import { hashApiKey } from "@/features/core/domain/api-keys/hash-api-key";

export type AuthenticatedMcpRequest = {
  userId: string;
  keyName: string;
};

/**
 * requireApiKey
 *
 * Validates the x-api-key header and returns the associated userId.
 * Throws an error if invalid.
 */
export async function requireApiKey(
  request: Request,
): Promise<AuthenticatedMcpRequest> {
  const url = new URL(request.url);
  let apiKey =
    request.headers.get("x-api-key") || url.searchParams.get("x-api-key");

  // Support standard Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (!apiKey && authHeader?.startsWith("Bearer ")) {
    apiKey = authHeader.substring(7);
  }

  if (!apiKey) {
    throw new Error("Missing API Key");
  }

  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("user_id, name, revoked_at, key_hash")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .single();

  if (error || !data) {
    throw new Error("Invalid API Key");
  }

  return {
    userId: data.user_id,
    keyName: data.name,
  };
}
