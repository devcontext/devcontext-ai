import { ResolveRequest, ResolveResult } from "../types/resolver";
import { Project } from "../types/projects";
import { RuleDefinition } from "../types/rules";
import { CommandDefinition } from "../types/commands";
import { RulesetDefinition } from "../types/rulesets";
import { StackPresetDefinition } from "../types/stack-presets";
import { renderContract } from "../contracts/render-contract";
import {
  buildCandidateRuleIds,
  selectActiveRules,
  resolveRuleConflicts,
  compileConstraints,
  buildContract,
} from "./helpers";

export interface ResolveContext {
  project: Project;
  command: CommandDefinition;
  ruleset: RulesetDefinition;
  stackPreset: StackPresetDefinition;
  ruleCatalog: RuleDefinition[];
}

/**
 * Resolver Core Algorithm (v1.2 - Refactored Pipeline)
 * 
 * Implementación modular basada en helpers puros.
 */
export function resolve(request: ResolveRequest, context: ResolveContext): ResolveResult {
  const { project, command, ruleset, stackPreset, ruleCatalog } = context;

  // 1. Resolve Intent (Mapping fijo)
  const intentId = command.intentId;

  // 2. Candidate Rules
  const candidateRuleIds = buildCandidateRuleIds(ruleset, project.ruleToggles);

  // 3. Select Active Rules (Includes sorting)
  const activeRules = selectActiveRules(
    ruleCatalog,
    candidateRuleIds,
    project.ruleToggles,
    intentId
  );

  // 4. Resolve Conflicts
  const conflictResult = resolveRuleConflicts(activeRules);

  if (conflictResult.status === "blocked") {
    return {
      status: "blocked",
      blocked: {
        reason: "conflicting_rules",
        message: "Existen reglas contradictorias de severidad 'error'.",
        details: { conflicts: conflictResult.conflicts },
      },
    };
  }

  const resolvedRules = conflictResult.rules;

  // 5. Compile Constraints
  const constraints = compileConstraints(stackPreset, resolvedRules);

  // 6. Render Contract Text
  const contractText = renderContract({
    intentId,
    rules: resolvedRules,
    constraints: constraints,
    stackName: stackPreset.name,
  });

  // 7. Build Project Contract (Deterministic construction)
  const contract = buildContract(
    project,
    command,
    intentId,
    stackPreset,
    resolvedRules,
    constraints,
    contractText
  );

  return {
    status: "ok",
    contract,
  };
}
