import { supabaseAdmin } from "@/lib/supabase/admin";

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

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("user_id, name")
    .eq("key", apiKey)
    .single();

  if (error || !data) {
    console.error("Auth Fail: Invalid API Key or DB Error", {
      error,
      apiKey: apiKey.substring(0, 4) + "...",
    });
    throw new Error("Invalid API Key");
  }

  return {
    userId: data.user_id,
    keyName: data.name,
  };
}
