import { AccessTokenRepository } from "@/features/core/infra/db/access-tokens-repository";
import type { AccessTokenListItem } from "@/features/core/domain/types/access-tokens";
import { withAppContext } from "@/features/core/app/context/app-context";

/**
 * Lists all active access tokens for a user
 * @returns Array of access token metadata (no sensitive data)
 */
export async function listUserTokens(): Promise<AccessTokenListItem[]> {
  return withAppContext(async ({ supabase, userId }) => {
    const repository = new AccessTokenRepository(supabase);

    return await repository.listUserTokens(userId);
  });
}
