import { supabase } from "@/features/core/infra/db/supabase-client";

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
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new Error("Missing API Key");
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("user_id, name")
    .eq("key", apiKey)
    .single();

  if (error || !data) {
    throw new Error("Invalid API Key");
  }

  return {
    userId: data.user_id,
    keyName: data.name,
  };
}
