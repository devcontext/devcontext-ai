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
 * Throws an error (which the API routes should catch and return as 401) if invalid.
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
    console.error("Auth Fail: No API Key found in headers or search params");
    throw new Error("Missing API Key");
  }

  // Hash the API key to compare with stored hash
  const keyHash = hashApiKey(apiKey);

  // First, let's check if there are ANY api_keys
  const { data: allKeys, error: countError } = await supabaseAdmin
    .from("api_keys")
    .select("id, key_hash, name, revoked_at")
    .limit(5);

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("user_id, name, revoked_at, key_hash")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .single();

  console.log("[MCP Auth Result]", {
    found: !!data,
    error: error?.message,
    errorCode: error?.code,
    revokedAt: data?.revoked_at,
    foundHashLength: data?.key_hash?.length,
  });

  if (error || !data) {
    console.error("Auth Fail: Invalid API Key or DB Error", {
      error,
      apiKey: apiKey.substring(0, 10) + "...",
    });
    throw new Error("Invalid API Key");
  }

  return {
    userId: data.user_id,
    keyName: data.name,
  };
}
