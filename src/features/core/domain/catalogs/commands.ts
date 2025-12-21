import { CommandDefinition } from "../types/commands";

export const COMMAND_CATALOG: CommandDefinition[] = [
  {
    id: "create-component",
    displayName: "Create Component",
    intentId: "generate",
    templateId: "default-v1",
  },
  {
    id: "refactor-code",
    displayName: "Refactor Code",
    intentId: "refactor",
    templateId: "default-v1",
  },
  {
    id: "review-pr",
    displayName: "Review PR",
    intentId: "review",
    templateId: "default-v1",
  },
];
