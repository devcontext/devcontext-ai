export type Project = {
  id: string;
  name: string;
  stackPresetId: string;
  activeRulesetId: string;
  ruleToggles: Record<string, boolean>; // ruleId -> true (enabled) | false (disabled)
};
