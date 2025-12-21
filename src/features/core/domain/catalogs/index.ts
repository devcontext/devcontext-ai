import { RULE_CATALOG } from "./rules";
import { RULESET_CATALOG } from "./rulesets";
import { COMMAND_CATALOG } from "./commands";
import { STACK_PRESET_CATALOG } from "./stack-presets";

// Getters
export const getRuleById = (id: string) => RULE_CATALOG.find((r) => r.id === id);
export const getRulesetById = (id: string) => RULESET_CATALOG.find((rs) => rs.id === id);
export const getCommandById = (id: string) => COMMAND_CATALOG.find((c) => c.id === id);
export const getStackPresetById = (id: string) => STACK_PRESET_CATALOG.find((sp) => sp.id === id);

// Expose full catalogs if needed
export { RULE_CATALOG, RULESET_CATALOG, COMMAND_CATALOG, STACK_PRESET_CATALOG };
