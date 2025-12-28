import { supabase } from "./supabase-client"
import { Source, SourceInput } from "../../domain/types/sources"

/**
 * Maps database row (snake_case) to domain entity (camelCase)
 */
function toDomain(row: Record<string, unknown>): Source {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    type: row.type as "file" | "text",
    content: row.content as string,
    createdAt: row.created_at as string,
  }
}

/**
 * Maps domain entity (camelCase) to database row (snake_case)
 */
function toDb(input: SourceInput): Record<string, unknown> {
  return {
    project_id: input.projectId,
    name: input.name,
    type: input.type,
    content: input.content,
  }
}

export const sourcesRepository = {
  async createSource(input: SourceInput): Promise<Source | null> {
    const { data, error } = await supabase
      .from("sources")
      .insert(toDb(input))
      .select()
      .single()

    if (error || !data) return null
    return toDomain(data)
  },

  async getSourcesByProjectId(projectId: string): Promise<Source[]> {
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data.map(toDomain)
  },

  async deleteSource(id: string): Promise<void> {
    await supabase.from("sources").delete().eq("id", id)
  },
}
