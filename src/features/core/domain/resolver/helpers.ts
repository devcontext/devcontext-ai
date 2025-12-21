import { RulesetDefinition } from "../types/rulesets";
import { RuleDefinition } from "../types/rules";
import { IntentId } from "../types/intent";
import { StackPresetDefinition } from "../types/stack-presets";
import { Project } from "../types/projects";
import { CommandDefinition } from "../types/commands";
import { ResolvedContract } from "../types/contracts";

/**
 * 1) buildCandidateRuleIds
 * Logic: ruleset.ruleIds + optionalRuleIds enabled by toggle===true
 */
export function buildCandidateRuleIds(
  ruleset: RulesetDefinition,
  ruleToggles: Record<string, boolean>
): string[] {
  return [
    ...ruleset.ruleIds,
    ...ruleset.optionalRuleIds.filter((id) => ruleToggles[id] === true),
  ];
}

/**
 * 2) selectActiveRules
 * Filters: id in candidateRuleIds, toggle !== false, appliesToIntents includes intentId
 * Returns deterministically sorted by id lexicographically.
 */
export function selectActiveRules(
  ruleCatalog: RuleDefinition[],
  candidateRuleIds: string[],
  ruleToggles: Record<string, boolean>,
  intentId: IntentId
): RuleDefinition[] {
  const active = ruleCatalog.filter(
    (rule) =>
      candidateRuleIds.includes(rule.id) &&
      ruleToggles[rule.id] !== false &&
      rule.appliesToIntents.includes(intentId)
  );

  return [...active].sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 3) resolveRuleConflicts
 * Deterministic conflict rules:
 * 1. error vs error -> blocked
 * 2. error vs warn/info -> keep error
 * 3. warn vs info -> keep warn
 * 4. warn vs warn -> keep lexicographically smaller id
 * 5. info vs info -> keep lexicographically smaller id
 */
export function resolveRuleConflicts(activeRules: RuleDefinition[]): 
  | { status: "ok"; rules: RuleDefinition[] }
  | { status: "blocked"; conflicts: Array<{ a: string; b: string; why: string }> } {
  
  const conflicts: Array<{ a: string; b: string; why: string }> = [];
  const droppedRules = new Set<string>();

  // activeRules is already sorted by id from selectActiveRules
  for (let i = 0; i < activeRules.length; i++) {
    const ruleA = activeRules[i]!;
    if (droppedRules.has(ruleA.id)) continue;

    for (let j = i + 1; j < activeRules.length; j++) {
      const ruleB = activeRules[j]!;
      if (droppedRules.has(ruleB.id)) continue;

      const aConflictsWithB = ruleA.conflictsWith?.includes(ruleB.id);
      const bConflictsWithA = ruleB.conflictsWith?.includes(ruleA.id);

      if (aConflictsWithB || bConflictsWithA) {
        if (ruleA.severity === "error" && ruleB.severity === "error") {
          conflicts.push({
            a: ruleA.id,
            b: ruleB.id,
            why: "Both are non-negotiable errors.",
          });
          continue;
        }

        // error vs others
        if (ruleA.severity === "error") { droppedRules.add(ruleB.id); continue; }
        if (ruleB.severity === "error") { droppedRules.add(ruleA.id); continue; }

        // warn vs info
        if (ruleA.severity === "warn" && ruleB.severity === "info") { droppedRules.add(ruleB.id); continue; }
        if (ruleB.severity === "warn" && ruleA.severity === "info") { droppedRules.add(ruleA.id); continue; }

        // warn vs warn / info vs info -> smaller id wins.
        // Since they are sorted, ruleA.id < ruleB.id. Keep A, drop B.
        droppedRules.add(ruleB.id);
      }
    }
  }

  if (conflicts.length > 0) {
    return { status: "blocked", conflicts };
  }

  const finalRules = activeRules.filter((r) => !droppedRules.has(r.id));
  return { status: "ok", rules: finalRules };
}

/**
 * 4) compileConstraints
 * Merge: stackPreset.constraints first, then each rule.contributesConstraints overrides
 */
export function compileConstraints(
  stackPreset: StackPresetDefinition,
  rules: RuleDefinition[]
): Record<string, unknown> {
  const constraints: Record<string, unknown> = {
    ...(stackPreset.constraints || {}),
  };

  for (const rule of rules) {
    if (rule.contributesConstraints) {
      Object.assign(constraints, rule.contributesConstraints);
    }
  }

  return constraints;
}

/**
 * 5) buildContract
 * Pure construction. No random/time fields.
 * id and generatedAt are now optional and NOT set here.
 */
export function buildContract(
  project: Project,
  command: CommandDefinition,
  intentId: IntentId,
  stackPreset: StackPresetDefinition,
  rules: RuleDefinition[],
  constraints: Record<string, unknown>,
  contractText: string
): ResolvedContract {
  return {
    projectId: project.id,
    commandId: command.id,
    intentId,
    contractText,
    meta: {
      stackPresetId: stackPreset.id,
      rulesApplied: rules.map((r) => ({ id: r.id, severity: r.severity })),
      constraintsApplied: constraints,
      stopConditions: [
        "If any rule must be violated, STOP and ask for explicit permission.",
        "If required information is missing, ask instead of guessing.",
      ],
    },
  };
}
