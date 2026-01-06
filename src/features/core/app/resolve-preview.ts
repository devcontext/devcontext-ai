import { type SupabaseClient } from "@supabase/supabase-js";
import { ProjectsRepository } from "../infra/db/projects-repository";
import { TogglesRepository } from "../infra/db/toggles-repository";
import {
  getCommandById,
  getStackPresetById,
  getRulesetById,
  RULE_CATALOG,
} from "../domain/catalogs";
import { resolve } from "../domain/resolver/resolve";
import { ResolveRequest, ResolveResult } from "../domain/types/resolver";

/**
 * resolvePreview
 *
 * Orchestrates loading data from infra and executing the pure domain resolver.
 * Enriches the final contract with execution-specific metadata (IDs, Timestamps).
 */
export async function resolvePreview(
  request: ResolveRequest,
  supabase: SupabaseClient,
): Promise<ResolveResult> {
  const projectsRepository = new ProjectsRepository(supabase);
  const togglesRepository = new TogglesRepository(supabase);

  // 1. Load Data (Infra)
  const project = await projectsRepository.getById(request.projectId);

  if (!project) {
    return {
      status: "blocked",
      blocked: {
        reason: "missing_project",
        message: `Project with ID ${request.projectId} not found.`,
      },
    };
  }

  // Load toggles and merge into the project model for the resolver
  const ruleToggles = await togglesRepository.getByProject(project.id);
  const projectWithToggles = {
    ...project,
    ruleToggles,
  };

  // 2. Load Catalogs (Domain)
  const command = getCommandById(request.commandId);
  if (!command) {
    return {
      status: "blocked",
      blocked: {
        reason: "unknown_command",
        message: `Command "${request.commandId}" is not defined in the system catalog.`,
      },
    };
  }

  const stackPresetId = project.stackPresetId;
  const stackPreset = stackPresetId ? getStackPresetById(stackPresetId) : null;
  if (!stackPreset) {
    return {
      status: "blocked",
      blocked: {
        reason: "invalid_configuration",
        message: `The project stack preset "${stackPresetId}" is invalid or missing.`,
      },
    };
  }

  const activeRulesetId = project.activeRulesetId;
  const ruleset = activeRulesetId ? getRulesetById(activeRulesetId) : null;
  if (!ruleset) {
    return {
      status: "blocked",
      blocked: {
        reason: "invalid_configuration",
        message: `The ruleset "${activeRulesetId}" assigned to this project is missing.`,
      },
    };
  }

  // 3. Resolve (Pure Domain Logic)
  const result = resolve(request, {
    project: projectWithToggles,
    command,
    ruleset,
    stackPreset,
    ruleCatalog: RULE_CATALOG,
  });

  // 4. Enrich Result (App Layer Responsibility)
  if (result.status === "ok") {
    const enrichedContract = {
      ...result.contract,
      id: `rc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      meta: {
        ...result.contract.meta,
        generatedAt: new Date().toISOString(),
      },
    };

    return { ...result, contract: enrichedContract };
  }

  return result;
}
