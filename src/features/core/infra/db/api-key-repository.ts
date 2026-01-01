import { supabase } from "./supabase-client";

import type {
  ApiKey,
  ApiKeyCreateInput,
  ApiKeyListItem,
} from "../../domain/api-keys/types";

export class ApiKeyRepository {
  /**
   * Creates a new API key in the database
   */
  async createApiKey(input: ApiKeyCreateInput): Promise<ApiKey> {
    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: input.userId,
        name: input.name,
        key_hash: input.keyHash,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }

    return this.mapToApiKey(data);
  }

  /**
   * Lists all active (non-revoked) API keys for a user
   */
  async listUserApiKeys(userId: string): Promise<ApiKeyListItem[]> {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, created_at, last_used_at")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to list API keys: ${error.message}`);
    }

    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: new Date(item.created_at),
      lastUsedAt: item.last_used_at ? new Date(item.last_used_at) : null,
    }));
  }

  /**
   * Finds an API key by its hash (for authentication)
   */
  async findByKeyHash(keyHash: string): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from("api_keys")
      .select()
      .eq("key_hash", keyHash)
      .is("revoked_at", null)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to find API key: ${error.message}`);
    }

    return this.mapToApiKey(data);
  }

  /**
   * Revokes an API key (soft delete)
   */
  async revokeApiKey(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to revoke API key: ${error.message}`);
    }
  }

  /**
   * Updates the last_used_at timestamp for an API key
   */
  async updateLastUsed(id: string): Promise<void> {
    const { error } = await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      // Log but don't throw - this is not critical
      console.error("Failed to update last_used_at:", error.message);
    }
  }

  /**
   * Maps database row to ApiKey domain type
   */
  private mapToApiKey(data: any): ApiKey {
    return {
      id: data.id,
      userId: data.user_id,
      keyHash: data.key_hash,
      name: data.name,
      lastUsedAt: data.last_used_at ? new Date(data.last_used_at) : null,
      revokedAt: data.revoked_at ? new Date(data.revoked_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

// Export singleton instance
export const apiKeyRepository = new ApiKeyRepository();
