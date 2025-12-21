import { IntentId } from "./intent";

export type ResolvedContract = {
  id?: string;
  projectId: string;
  commandId: string;
  intentId: IntentId;

  // Human-readable contract text sent to the AI
  contractText: string;

  // Metadata for logging/debug/auditing
  meta: {
    stackPresetId: string;
    rulesApplied: Array<{ id: string; severity: "error" | "warn" | "info" }>;
    constraintsApplied: Record<string, unknown>;
    stopConditions: string[];
    generatedAt?: string; // ISO
  };
};
