import { supabase } from "./supabase-client"
import { Project, ProjectInput } from "../../domain/types/projects"

/**
 * Maps database row (snake_case) to domain entity (camelCase)
 */
function toDomain(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    ownerUserId: row.owner_user_id as string,
    name: row.name as string,
    stackPresetId: row.stack_preset_id as string | null,
    activeRulesetId: row.active_ruleset_id as string | null,
    ruleToggles: (row.rule_toggles as Record<string, boolean>) || {},
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

/**
 * Maps domain entity (camelCase) to database row (snake_case)
 */
function toDb(input: ProjectInput): Record<string, unknown> {
  return {
    owner_user_id: input.ownerUserId,
    name: input.name,
    stack_preset_id: input.stackPresetId,
    active_ruleset_id: input.activeRulesetId,
    rule_toggles: input.ruleToggles,
  }
}

export const projectsRepository = {
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) return null
    return toDomain(data)
  },

  async getByOwnerId(ownerUserId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_user_id", ownerUserId)
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data.map(toDomain)
  },

  async create(input: ProjectInput): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .insert(toDb(input))
      .select()
      .single()

    if (error || !data) return null
    return toDomain(data)
  },

  async update(id: string, updates: Partial<ProjectInput>): Promise<Project | null> {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.stackPresetId !== undefined) dbUpdates.stack_preset_id = updates.stackPresetId
    if (updates.activeRulesetId !== undefined) dbUpdates.active_ruleset_id = updates.activeRulesetId
    if (updates.ruleToggles !== undefined) dbUpdates.rule_toggles = updates.ruleToggles

    const { data, error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error || !data) return null
    return toDomain(data)
  },

  async delete(id: string): Promise<void> {
    await supabase.from("projects").delete().eq("id", id)
  },
}
