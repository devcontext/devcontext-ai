import { IntentId } from "./intents";

export type RuleDefinition = {
  id: string;
  title: string;
  description: string;
  severity: "error" | "warn" | "info";
  appliesToIntents: IntentId[];

  // Contract fragments
  directive: string; // e.g. "Do NOT install new dependencies."

  // Optional conflict map (MVP: small static list)
  conflictsWith?: string[];

  // Optional constraint contributions
  contributesConstraints?: Record<string, unknown>;
};
