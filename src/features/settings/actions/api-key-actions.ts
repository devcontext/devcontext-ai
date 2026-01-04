"use server";

import { revalidatePath } from "next/cache";
import { generateUserApiKey } from "@/features/core/app/api-keys/generate-user-api-key";
import { revokeUserApiKey } from "@/features/core/app/api-keys/revoke-user-api-key";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import {
  errorResponse,
  handleErrorResponse,
  successResponse,
} from "@/features/shared/utils/error-handler";
import type { ApiResponse } from "@/features/shared/types/api-response";

/**
 * Server action to generate a new API key
 */
export async function generateApiKeyAction(
  name: string,
): Promise<ApiResponse<{ key: string }>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!name || name.trim().length === 0) {
      return errorResponse("API key name is required");
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await generateUserApiKey(supabase, user.id, name.trim());

    if (result.success) {
      revalidatePath("/dashboard/settings");
      return successResponse({ key: result.apiKey });
    }

    return errorResponse(result.error || "Failed to generate API key");
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to revoke an API key
 */
export async function revokeApiKeyAction(
  keyId: string,
): Promise<ApiResponse<void>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!keyId || keyId.trim().length === 0) {
      return errorResponse("API key ID is required");
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await revokeUserApiKey(supabase, keyId, user.id);

    if (result.success) {
      revalidatePath("/dashboard/settings");
      return successResponse(undefined);
    }

    return errorResponse(result.error || "Failed to revoke API key");
  } catch (error) {
    return handleErrorResponse(error);
  }
}
