"use server";

import { revalidatePath } from "next/cache";
import { generateUserApiKey } from "@/features/core/app/api-keys/generate-user-api-key";
import { revokeUserApiKey } from "@/features/core/app/api-keys/revoke-user-api-key";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";

/**
 * Server action to generate a new API key
 */
export async function generateApiKeyAction(name: string) {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "API key name is required",
      };
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await generateUserApiKey(supabase, user.id, name.trim());

    if (result.success) {
      revalidatePath("/dashboard/settings");
    }

    return result;
  } catch (error) {
    console.error("Error generating API key:", error);
    return {
      success: false,
      error: "An unexpected error occurred while generating the API key",
    };
  }
}

/**
 * Server action to revoke an API key
 */
export async function revokeApiKeyAction(keyId: string) {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!keyId || keyId.trim().length === 0) {
      return {
        success: false,
        error: "API key ID is required",
      };
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await revokeUserApiKey(supabase, keyId, user.id);

    if (result.success) {
      revalidatePath("/dashboard/settings");
    }

    return result;
  } catch (error) {
    console.error("Error revoking API key:", error);
    return {
      success: false,
      error: "An unexpected error occurred while revoking the API key",
    };
  }
}
