"use server";

import { revalidatePath } from "next/cache";
import { generateUserApiKey } from "@/features/core/app/api-keys/generate-user-api-key";
import { revokeUserApiKey } from "@/features/core/app/api-keys/revoke-user-api-key";
import { createClient } from "@/features/core/infra/supabase-server";

/**
 * Server action to generate a new API key
 */
export async function generateApiKeyAction(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "Unauthorized",
    };
  }

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "Unauthorized",
    };
  }

  const result = await revokeUserApiKey(keyId, user.id);

  if (result.success) {
    revalidatePath("/dashboard/settings");
  }

  return result;
}
