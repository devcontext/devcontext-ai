import { SupabaseClient } from "@supabase/supabase-js";
import { Project, ProjectInput } from "../../domain/types/projects";
import { NotFoundError, UnexpectedError } from "../../domain/errors";

/**
 * Maps database row (snake_case) to domain entity (camelCase)
 */
function toDomain(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    slug: row.slug as string,
    ownerUserId: row.owner_user_id as string,
    name: row.name as string,
    stackPresetId: row.stack_preset_id as string | null,
    activeRulesetId: row.active_ruleset_id as string | null,
    ruleToggles: (row.rule_toggles as Record<string, boolean>) || {},
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/**
 * Maps domain entity (camelCase) to database row (snake_case)
 */
function toDb(
  input: ProjectInput & { slug?: string },
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    owner_user_id: input.ownerUserId,
    name: input.name,
    stack_preset_id: input.stackPresetId,
    active_ruleset_id: input.activeRulesetId,
    rule_toggles: input.ruleToggles,
  };
  if (input.slug !== undefined) {
    result.slug = input.slug;
  }
  return result;
}

/**
 * Projects repository
 *
 * DATA FETCHING PATTERN (Rule #6-10):
 * - Receives Supabase client via constructor (NOT created internally)
 * - Client is created ONCE per request in withAppContext
 * - Repository is instantiated by services with the shared client
 */
export class ProjectsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getById(id: string): Promise<Project> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        throw new NotFoundError(`Project with ID ${id} not found`, {
          projectId: id,
        });
      }

      return toDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError("Failed to fetch project by ID", {
        projectId: id,
        originalError: error,
      });
    }
  }

  async getBySlug(slug: string, ownerUserId: string): Promise<Project> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("owner_user_id", ownerUserId)
        .single();

      if (error || !data) {
        throw new NotFoundError(`Project with slug "${slug}" not found`, {
          slug,
          ownerUserId,
        });
      }

      return toDomain(data);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError("Failed to fetch project by slug", {
        slug,
        ownerUserId,
        originalError: error,
      });
    }
  }

  async getByOwnerId(ownerUserId: string): Promise<Project[]> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("owner_user_id", ownerUserId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new UnexpectedError("Failed to fetch projects by owner ID", {
          ownerUserId,
          error,
        });
      }

      return data?.map(toDomain) || [];
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "An unexpected error occurred while fetching projects",
        { originalError: error },
      );
    }
  }

  async create(input: ProjectInput & { slug?: string }): Promise<Project> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .insert(toDb(input))
        .select()
        .single();

      if (error || !data) {
        throw new UnexpectedError("Error creating project", { input, error });
      }

      return toDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "An unexpected error occurred during project creation",
        { originalError: error },
      );
    }
  }

  async update(id: string, updates: Partial<ProjectInput>): Promise<Project> {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.stackPresetId !== undefined)
        dbUpdates.stack_preset_id = updates.stackPresetId;
      if (updates.activeRulesetId !== undefined)
        dbUpdates.active_ruleset_id = updates.activeRulesetId;
      if (updates.ruleToggles !== undefined)
        dbUpdates.rule_toggles = updates.ruleToggles;

      const { data, error } = await this.supabase
        .from("projects")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        throw new UnexpectedError("Error updating project", {
          id,
          updates,
          error,
        });
      }

      return toDomain(data);
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "An unexpected error occurred during project update",
        { originalError: error },
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("projects")
        .delete()
        .eq("id", id);
      if (error) {
        throw new UnexpectedError("Error deleting project", { id, error });
      }
    } catch (error) {
      if (error instanceof UnexpectedError) throw error;
      throw new UnexpectedError(
        "An unexpected error occurred during project deletion",
        { originalError: error },
      );
    }
  }
}
