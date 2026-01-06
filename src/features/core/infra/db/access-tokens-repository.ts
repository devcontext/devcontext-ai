import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AccessToken,
  AccessTokenCreateInput,
  AccessTokenListItem,
} from "../../domain/types/access-tokens";
import { NotFoundError, UnexpectedError } from "../../domain/errors";

/**
 * Maps database row to AccessToken domain type
 */
function toAccessTokenDomain(row: Record<string, any>): AccessToken {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    name: row.name,
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
    revokedAt: row.revoked_at ? new Date(row.revoked_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Maps database row to AccessTokenListItem domain type
 */
function toAccessTokenListItemDomain(
  row: Record<string, any>,
): AccessTokenListItem {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
  };
}

/**
 * Maps AccessToken input to database row
 */
function accessTokenToDb(input: AccessTokenCreateInput): Record<string, any> {
  return {
    user_id: input.userId,
    name: input.name,
    token_hash: input.tokenHash,
  };
}

export class AccessTokenRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Creates a new access token in the database
   */
  async createToken(input: AccessTokenCreateInput): Promise<AccessToken> {
    try {
      const { data, error } = await this.supabase
        .from("access_tokens")
        .insert(accessTokenToDb(input))
        .select()
        .single();

      if (error) {
        throw new UnexpectedError(
          `Failed to create access token: ${error.message}`,
          {
            cause: error,
            input: { ...input, tokenHash: "[REDACTED]" },
          },
        );
      }

      if (!data) {
        throw new UnexpectedError(
          "No data returned after access token creation",
        );
      }

      return toAccessTokenDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "Unexpected error during access token creation",
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Lists all active (non-revoked) access tokens for a user
   */
  async listUserTokens(userId: string): Promise<AccessTokenListItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("access_tokens")
        .select("id, name, created_at, last_used_at")
        .eq("user_id", userId)
        .is("revoked_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        throw new UnexpectedError(
          `Failed to list access tokens: ${error.message}`,
          {
            cause: error,
            userId,
          },
        );
      }

      return (data || []).map(toAccessTokenListItemDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error listing access tokens", {
        cause: error,
        userId,
      });
    }
  }

  /**
   * Finds an access token by its hash (for authentication)
   */
  async findByTokenHash(tokenHash: string): Promise<AccessToken | null> {
    try {
      const { data, error } = await this.supabase
        .from("access_tokens")
        .select()
        .eq("token_hash", tokenHash)
        .is("revoked_at", null)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new UnexpectedError(
          `Failed to find access token: ${error.message}`,
          {
            cause: error,
          },
        );
      }

      if (!data) return null;

      return toAccessTokenDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "Unexpected error finding access token by hash",
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Revokes an access token (soft delete)
   */
  async revokeToken(id: string, userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from("access_tokens")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) {
        throw new UnexpectedError(
          `Failed to revoke access token: ${error.message}`,
          {
            cause: error,
            id,
            userId,
          },
        );
      }

      if (!data || data.length === 0) {
        throw new NotFoundError("Access token not found or already revoked");
      }
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        throw error;
      }
      throw new UnexpectedError(
        "Unexpected error during access token revocation",
        {
          cause: error,
          id,
          userId,
        },
      );
    }
  }

  /**
   * Updates the last_used_at timestamp for an access token
   */
  async updateLastUsed(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("access_tokens")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        // Log but don't throw - this is not critical for the main flow
        console.error(
          "[AccessTokenRepository] Failed to update last_used_at:",
          error.message,
        );
      }
    } catch (error) {
      // Catch and log any unexpected exceptions
      console.error(
        "[AccessTokenRepository] Unexpected error updating last_used_at:",
        error,
      );
    }
  }
}
