import { projectsRepository } from "@/features/core/infra/db/projects-repository";
import { togglesRepository } from "@/features/core/infra/db/toggles-repository";
import { 
  getCommandById, 
  getStackPresetById, 
  getRulesetById, 
  RULE_CATALOG 
} from "@/features/core/domain/catalogs";
import { resolve } from "@/features/core/domain/resolver/resolve";
import { ResolveRequest, ResolveResult } from "@/features/core/domain/types/resolver";

/**
 * resolvePreview
 * 
 * Orchestrates loading data from infra and executing the pure domain resolver.
 * Enriches the final contract with execution-specific metadata (IDs, Timestamps).
 */
export async function resolvePreview(request: ResolveRequest): Promise<ResolveResult> {
  // 1. Load Data (Infra)
  const project = await projectsRepository.getById(request.projectId);

  if (!project) {
    return {
      status: "blocked",
      blocked: { 
        reason: "missing_project", 
        message: `Project with ID ${request.projectId} not found.` 
      }
    };
  }

  // Load toggles and merge into the project model for the resolver
  const ruleToggles = await togglesRepository.getByProject(project.id);
  const projectWithToggles = { ...project, ruleToggles };

  // 2. Load Catalogs (Domain)
  const command = getCommandById(request.commandId);
  if (!command) {
    return {
      status: "blocked",
      blocked: { 
        reason: "unknown_command", 
        message: `Command "${request.commandId}" is not defined in the system catalog.` 
      }
    };
  }

  const stackPreset = getStackPresetById(project.stackPresetId);
  if (!stackPreset) {
    return {
      status: "blocked",
      blocked: { 
        reason: "invalid_configuration", 
        message: `The project stack preset "${project.stackPresetId}" is invalid or missing.` 
      }
    };
  }

  const ruleset = getRulesetById(project.activeRulesetId);
  if (!ruleset) {
    return {
      status: "blocked",
      blocked: { 
        reason: "invalid_configuration", 
        message: `The ruleset "${project.activeRulesetId}" assigned to this project is missing.` 
      }
    };
  }

  // 3. Resolve (Pure Domain Logic)
  const result = resolve(request, {
    project: projectWithToggles,
    command,
    ruleset,
    stackPreset,
    ruleCatalog: RULE_CATALOG
  });

  // 4. Enrich Result (App Layer Responsibility)
  // Here we add the non-deterministic data that the Domain layer is not allowed to touch.
  if (result.status === "ok") {
    result.contract.id = `rc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    result.contract.meta.generatedAt = new Date().toISOString();
  }

  return result;
}
