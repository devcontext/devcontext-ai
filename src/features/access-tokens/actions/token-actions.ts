"use server";

import { revalidatePath } from "next/cache";
import { generateUserToken } from "../services/generate-user-token";
import { revokeUserToken } from "../services/revoke-user-token";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import {
  errorResponse,
  handleErrorResponse,
  successResponse,
} from "@/features/shared/utils/error-handler";
import type { ApiResponse } from "@/features/shared/types/api-response";
import { accessTokensRoutes } from "../routes";

/**
 * Server action to generate a new access token
 */
export async function generateAccessTokenAction(
  name: string,
): Promise<ApiResponse<{ token: string }>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!name || name.trim().length === 0) {
      return errorResponse("Access token name is required");
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await generateUserToken(supabase, user.id, name.trim());

    if (result.success) {
      revalidatePath(accessTokensRoutes.root.path);
      return successResponse({ token: result.accessToken });
    }

    return errorResponse(result.error || "Failed to generate access token");
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to revoke an access token
 */
export async function revokeAccessTokenAction(
  tokenId: string,
): Promise<ApiResponse<void>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input
    if (!tokenId || tokenId.trim().length === 0) {
      return errorResponse("Access token ID is required");
    }

    // Create authenticated Supabase client
    const supabase = await createSupabaseServerClient();

    const result = await revokeUserToken(supabase, tokenId, user.id);

    if (result.success) {
      revalidatePath(accessTokensRoutes.root.path);
      return successResponse(undefined);
    }

    return errorResponse(result.error || "Failed to revoke access token");
  } catch (error) {
    return handleErrorResponse(error);
  }
}
