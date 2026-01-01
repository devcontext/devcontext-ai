"use server";

import { revalidatePath } from "next/cache";
import { generateUserApiKey } from "@/features/core/app/api-keys/generate-user-api-key";
import { revokeUserApiKey } from "@/features/core/app/api-keys/revoke-user-api-key";
import { requireUser } from "@/features/auth/utils/get-user";

/**
 * Server action to generate a new API key
 */
export async function generateApiKeyAction(name: string) {
  // Get authenticated user (redirects to login if not authenticated)
  const user = await requireUser();

  const result = await generateUserApiKey(user.id, name);

  if (result.success) {
    revalidatePath("/dashboard/settings");
  }

  return result;
}

/**
 * Server action to revoke an API key
 */
export async function revokeApiKeyAction(keyId: string) {
  // Get authenticated user (redirects to login if not authenticated)
  const user = await requireUser();

  const result = await revokeUserApiKey(keyId, user.id);

  if (result.success) {
    revalidatePath("/dashboard/settings");
  }

  return result;
}
