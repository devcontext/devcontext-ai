import { IntentId } from "../types/intent";
import { RuleDefinition } from "../types/rules";
import { CONTRACT_TEMPLATE_V1 } from "./contract-template-v1";

interface RenderContractData {
  intentId: IntentId;
  rules: RuleDefinition[];
  constraints: Record<string, unknown>;
  stackName: string;
}

const INTENT_MAP: Record<IntentId, string> = {
  generate: "CODE GENERATION",
  refactor: "CODE REFACTORING",
  review: "CODE REVIEW",
};

export function renderContract(data: RenderContractData): string {
  const { intentId, rules, constraints, stackName } = data;

  const intentHuman = INTENT_MAP[intentId];

  const rulesBullets = rules
    .map((rule) => `- ${rule.directive}`)
    .join("\n");

  const constraintsBullets = Object.entries(constraints)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");

  const stackBullets = `- Framework/Stack: ${stackName}`;

  return CONTRACT_TEMPLATE_V1
    .replace("{INTENT_HUMAN}", intentHuman)
    .replace("{RULES_BULLETS}", rulesBullets || "- No specific rules applied.")
    .replace("{CONSTRAINTS_BULLETS}", constraintsBullets || "- No specific constraints applied.")
    .replace("{STACK_BULLETS}", stackBullets);
}
