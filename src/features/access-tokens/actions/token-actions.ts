"use server";

import { revalidatePath } from "next/cache";
import { generateUserToken } from "../services/generate-user-token";
import { revokeUserToken } from "../services/revoke-user-token";
import { listUserTokens } from "../services/list-user-tokens";
import {
  handleErrorResponse,
  successResponse,
  validationErrorResponse,
} from "@/features/shared/utils/error-handler";
import type { ApiResponse } from "@/features/shared/types/api-response";
import { settingsRoutes } from "@/features/settings/routes";
import type { AccessTokenListItem } from "@/features/core/domain/types/access-tokens";
import {
  generateTokenSchema,
  revokeTokenSchema,
  type GenerateTokenValues,
} from "../schemas";

/**
 * Server action to list all access tokens for the current user
 */
export async function listAccessTokensAction(): Promise<
  ApiResponse<AccessTokenListItem[]>
> {
  try {
    const tokens = await listUserTokens();
    return successResponse(tokens);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to generate a new access token
 */
export async function generateAccessTokenAction(
  input: GenerateTokenValues,
): Promise<ApiResponse<{ token: string }>> {
  try {
    // Validate input with schema
    const validation = generateTokenSchema.safeParse(input);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { name } = validation.data;
    const result = await generateUserToken(name);

    revalidatePath(settingsRoutes.accessTokens.path);
    return successResponse({ token: result.accessToken });
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
    const validation = revokeTokenSchema.safeParse({ tokenId });
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    await revokeUserToken(validation.data.tokenId);

    revalidatePath(settingsRoutes.accessTokens.path);
    return successResponse(undefined);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to regenerate an access token
 * Revokes the old token and generates a new one with the same name
 */
export async function regenerateAccessTokenAction(
  tokenId: string,
  name: string,
): Promise<ApiResponse<{ token: string }>> {
  try {
    // Validate inputs
    const validation = revokeTokenSchema.safeParse({ tokenId });
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    // Revoke old token
    await revokeUserToken(validation.data.tokenId);

    // Generate new token with same name
    const result = await generateUserToken(name);

    revalidatePath(settingsRoutes.accessTokens.path);
    return successResponse({ token: result.accessToken });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
