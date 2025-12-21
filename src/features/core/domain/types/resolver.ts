export type ResolveRequest = {
  projectId: string;
  commandId: string; // e.g. "create-component"
  userInput: string; // e.g. "Button with variants"
  target?: {
    // Optional hints. MVP should not depend on these.
    pathHint?: string; // e.g. "src/components"
    files?: string[];  // e.g. ["src/components/button.tsx"]
  };
  contextHints?: {
    // Optional. MVP may ignore.
    currentBranch?: string;
    tool?: "cursor" | "chatgpt" | "gemini" | "unknown";
  };
};

export type BlockedResolution = {
  reason:
    | "unknown_command"
    | "missing_project"
    | "conflicting_rules"
    | "invalid_configuration";

  message: string; // Human readable

  details?: {
    conflicts?: Array<{ a: string; b: string; why: string }>;
  };
};
