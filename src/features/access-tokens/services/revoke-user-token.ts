import { AccessTokenRepository } from "@/features/core/infra/db/access-tokens-repository";
import { withAppContext } from "@/features/core/app/context/app-context";

/**
 * Revokes an access token (soft delete)
 * Validates ownership before revoking
 * @param tokenId - The access token ID to revoke
 * @returns void on success
 * @throws {UnexpectedError} If database operation fails
 */
export async function revokeUserToken(tokenId: string): Promise<void> {
  return withAppContext(async ({ supabase, userId }) => {
    const repository = new AccessTokenRepository(supabase);
    await repository.revokeToken(tokenId, userId);
  });
}
