export type StackPresetDefinition = {
  id: string;
  name: string;
  description: string;
  defaultRulesetId: string;
  constraints?: Record<string, unknown>;
};
