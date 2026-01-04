import { type SupabaseClient } from "@supabase/supabase-js";
import {
  Context,
  ContextInput,
  ContextVersion,
  ContextVersionInput,
} from "../../domain/types/contexts";
import { NotFoundError, UnexpectedError } from "../../domain/errors";

/**
 * Maps database row to Context domain entity
 */
function toContextDomain(row: Record<string, unknown>): Context {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    tags: (row.tags as string[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/**
 * Maps database row to ContextVersion domain entity
 */
function toVersionDomain(row: Record<string, unknown>): ContextVersion {
  return {
    id: row.id as string,
    contextId: row.context_id as string,
    markdown: row.markdown as string,
    createdAt: row.created_at as string,
  };
}

/**
 * Maps Context input to database row
 */
function contextToDb(input: ContextInput): Record<string, unknown> {
  return {
    project_id: input.projectId,
    name: input.name,
    tags: input.tags,
  };
}

/**
 * Maps ContextVersion input to database row
 */
function versionToDb(input: ContextVersionInput): Record<string, unknown> {
  return {
    context_id: input.contextId,
    markdown: input.markdown,
  };
}

export class ContextsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  // ========== CONTEXT CRUD ==========

  async createContext(input: ContextInput): Promise<Context> {
    try {
      const { data, error } = await this.supabase
        .from("contexts")
        .insert(contextToDb(input))
        .select()
        .single();

      if (error) {
        throw new UnexpectedError(`Failed to create context: ${error.message}`);
      }

      if (!data) {
        throw new UnexpectedError("No data returned after context creation");
      }

      return toContextDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error during context creation", {
        cause: error,
      });
    }
  }

  async getContextsByProjectId(projectId: string): Promise<Context[]> {
    try {
      const { data, error } = await this.supabase
        .from("contexts")
        .select("*")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false });

      if (error) {
        throw new UnexpectedError(`Failed to fetch contexts: ${error.message}`);
      }

      return (data || []).map(toContextDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "Unexpected error fetching contexts by project",
        {
          cause: error,
        },
      );
    }
  }

  async getContextById(id: string): Promise<Context> {
    try {
      const { data, error } = await this.supabase
        .from("contexts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError(`Context with ID ${id} not found`);
        }
        throw new UnexpectedError(`Failed to fetch context: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundError(`Context with ID ${id} not found`);
      }

      return toContextDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        throw error;
      }
      throw new UnexpectedError("Unexpected error fetching context by ID", {
        cause: error,
      });
    }
  }

  async updateContext(
    id: string,
    updates: Partial<ContextInput>,
  ): Promise<Context> {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      const { data, error } = await this.supabase
        .from("contexts")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError(`Context with ID ${id} not found for update`);
        }
        throw new UnexpectedError(`Failed to update context: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundError(`Context with ID ${id} not found for update`);
      }

      return toContextDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        throw error;
      }
      throw new UnexpectedError("Unexpected error during context update", {
        cause: error,
      });
    }
  }

  async deleteContext(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("contexts")
        .delete()
        .eq("id", id);
      if (error) {
        throw new UnexpectedError(`Failed to delete context: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error during context deletion", {
        cause: error,
      });
    }
  }

  // ========== CONTEXT VERSION CRUD ==========

  async createContextVersion(
    input: ContextVersionInput,
  ): Promise<ContextVersion> {
    try {
      const { data, error } = await this.supabase
        .from("context_versions")
        .insert(versionToDb(input))
        .select()
        .single();

      if (error) {
        throw new UnexpectedError(
          `Failed to create context version: ${error.message}`,
        );
      }

      if (!data) {
        throw new UnexpectedError(
          "No data returned after context version creation",
        );
      }

      return toVersionDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error during version creation", {
        cause: error,
      });
    }
  }

  async getVersionsByContextId(contextId: string): Promise<ContextVersion[]> {
    try {
      const { data, error } = await this.supabase
        .from("context_versions")
        .select("*")
        .eq("context_id", contextId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new UnexpectedError(`Failed to fetch versions: ${error.message}`);
      }

      return (data || []).map(toVersionDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error fetching versions", {
        cause: error,
      });
    }
  }

  async getLatestVersion(contextId: string): Promise<ContextVersion> {
    try {
      const { data, error } = await this.supabase
        .from("context_versions")
        .select("*")
        .eq("context_id", contextId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError(`No versions found for context ${contextId}`);
        }
        throw new UnexpectedError(
          `Failed to fetch latest version: ${error.message}`,
        );
      }

      if (!data) {
        throw new NotFoundError(`No versions found for context ${contextId}`);
      }

      return toVersionDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        throw error;
      }
      throw new UnexpectedError("Unexpected error fetching latest version", {
        cause: error,
      });
    }
  }

  async getVersionById(id: string): Promise<ContextVersion> {
    try {
      const { data, error } = await this.supabase
        .from("context_versions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError(`Version with ID ${id} not found`);
        }
        throw new UnexpectedError(`Failed to fetch version: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundError(`Version with ID ${id} not found`);
      }

      return toVersionDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        throw error;
      }
      throw new UnexpectedError("Unexpected error fetching version by ID", {
        cause: error,
      });
    }
  }

  async getAllContexts(): Promise<Context[]> {
    try {
      const { data, error } = await this.supabase
        .from("contexts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        throw new UnexpectedError(
          `Failed to fetch all contexts: ${error.message}`,
        );
      }

      return (data || []).map(toContextDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error fetching all contexts", {
        cause: error,
      });
    }
  }

  async getContextsByUserId(userId: string): Promise<Context[]> {
    try {
      const { data, error } = await this.supabase
        .from("contexts")
        .select("*, projects!inner(owner_user_id)")
        .eq("projects.owner_user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        throw new UnexpectedError(
          `Failed to fetch contexts for user: ${error.message}`,
        );
      }

      return (data || []).map(toContextDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error fetching user contexts", {
        cause: error,
      });
    }
  }

  async searchContexts(filters: {
    userId: string;
    projectId?: string;
    projectSlug?: string;
    search?: string;
    tags?: string[];
  }): Promise<Context[]> {
    try {
      let query = this.supabase
        .from("contexts")
        .select("*, projects!inner(owner_user_id, slug)")
        .eq("projects.owner_user_id", filters.userId);

      if (filters.projectId) {
        query = query.eq("project_id", filters.projectId);
      }

      if (filters.projectSlug) {
        query = query.eq("projects.slug", filters.projectSlug);
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        // PG contains operator @> for tags array
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query.order("updated_at", {
        ascending: false,
      });

      if (error) {
        throw new UnexpectedError(
          `Failed to search contexts: ${error.message}`,
        );
      }

      return (data || []).map(toContextDomain);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError("Unexpected error searching contexts", {
        cause: error,
      });
    }
  }
}

export const contextsRepository = {
  // Legacy support if needed, but we should move to class instantiation
};
