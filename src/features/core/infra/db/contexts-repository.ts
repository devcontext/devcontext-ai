import { supabase } from "./supabase-client";
import {
  Context,
  ContextInput,
  ContextVersion,
  ContextVersionInput,
} from "../../domain/types/contexts";

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

export const contextsRepository = {
  // ========== CONTEXT CRUD ==========

  async createContext(input: ContextInput): Promise<Context | null> {
    const { data, error } = await supabase
      .from("contexts")
      .insert(contextToDb(input))
      .select()
      .single();

    if (error || !data) return null;
    return toContextDomain(data);
  },

  async getContextsByProjectId(projectId: string): Promise<Context[]> {
    const { data, error } = await supabase
      .from("contexts")
      .select("*")
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return data.map(toContextDomain);
  },

  async getContextById(id: string): Promise<Context | null> {
    const { data, error } = await supabase
      .from("contexts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toContextDomain(data);
  },

  async updateContext(
    id: string,
    updates: Partial<ContextInput>,
  ): Promise<Context | null> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { data, error } = await supabase
      .from("contexts")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return toContextDomain(data);
  },

  async deleteContext(id: string): Promise<void> {
    await supabase.from("contexts").delete().eq("id", id);
  },

  // ========== CONTEXT VERSION CRUD ==========

  async createContextVersion(
    input: ContextVersionInput,
  ): Promise<ContextVersion | null> {
    const { data, error } = await supabase
      .from("context_versions")
      .insert(versionToDb(input))
      .select()
      .single();

    if (error || !data) return null;
    return toVersionDomain(data);
  },

  async getVersionsByContextId(contextId: string): Promise<ContextVersion[]> {
    const { data, error } = await supabase
      .from("context_versions")
      .select("*")
      .eq("context_id", contextId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(toVersionDomain);
  },

  async getLatestVersion(contextId: string): Promise<ContextVersion | null> {
    const { data, error } = await supabase
      .from("context_versions")
      .select("*")
      .eq("context_id", contextId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return toVersionDomain(data);
  },

  async getVersionById(id: string): Promise<ContextVersion | null> {
    const { data, error } = await supabase
      .from("context_versions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toVersionDomain(data);
  },

  async getAllContexts(): Promise<Context[]> {
    const { data, error } = await supabase
      .from("contexts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return data.map(toContextDomain);
  },

  async getContextsByUserId(userId: string): Promise<Context[]> {
    const { data, error } = await supabase
      .from("contexts")
      .select("*, projects!inner(owner_user_id)")
      .eq("projects.owner_user_id", userId)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return data.map(toContextDomain);
  },
};
