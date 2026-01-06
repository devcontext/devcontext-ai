import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AccessToken,
  AccessTokenCreateInput,
  AccessTokenListItem,
} from "../types";

export class AccessTokenRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Creates a new access token in the database
   */
  async createToken(input: AccessTokenCreateInput): Promise<AccessToken> {
    const { data, error } = await this.supabase
      .from("access_tokens")
      .insert({
        user_id: input.userId,
        name: input.name,
        token_hash: input.tokenHash,
      })
      .select()
      .single();

    if (error) {
      console.error("[AccessTokenRepository] Insert error:", error);
      throw new Error(`Failed to create access token: ${error.message}`);
    }

    return this.mapToAccessToken(data);
  }

  /**
   * Lists all active (non-revoked) access tokens for a user
   */
  async listUserTokens(userId: string): Promise<AccessTokenListItem[]> {
    const { data, error } = await this.supabase
      .from("access_tokens")
      .select("id, name, created_at, last_used_at")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to list access tokens: ${error.message}`);
    }

    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: new Date(item.created_at),
      lastUsedAt: item.last_used_at ? new Date(item.last_used_at) : null,
    }));
  }

  /**
   * Finds an access token by its hash (for authentication)
   */
  async findByTokenHash(tokenHash: string): Promise<AccessToken | null> {
    const { data, error } = await this.supabase
      .from("access_tokens")
      .select()
      .eq("token_hash", tokenHash)
      .is("revoked_at", null)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to find access token: ${error.message}`);
    }

    return this.mapToAccessToken(data);
  }

  /**
   * Revokes an access token (soft delete)
   */
  async revokeToken(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to revoke access token: ${error.message}`);
    }
  }

  /**
   * Updates the last_used_at timestamp for an access token
   */
  async updateLastUsed(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("access_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      // Log but don't throw - this is not critical
      console.error("Failed to update last_used_at:", error.message);
    }
  }

  /**
   * Maps database row to AccessToken domain type
   */
  private mapToAccessToken(data: any): AccessToken {
    return {
      id: data.id,
      userId: data.user_id,
      tokenHash: data.token_hash,
      name: data.name,
      lastUsedAt: data.last_used_at ? new Date(data.last_used_at) : null,
      revokedAt: data.revoked_at ? new Date(data.revoked_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
