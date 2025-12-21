import { IntentId } from "./intents";

/**
 * CommandDefinition
 */
export type CommandDefinition = {
  id: string; // e.g. "create-component"
  displayName: string;
  intentId: IntentId;
  templateId: string; // contract template selector
};
