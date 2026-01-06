/**
 * Project entity - container for user data.
 * PURE TYPE: No I/O, no side effects.
 */
export type Project = {
  id: string;
  slug: string;
  ownerUserId: string;
  name: string;
  stackPresetId: string | null;
  activeRulesetId: string | null;
  ruleToggles: Record<string, boolean>;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

/**
 * Input type for creating a new Project.
 * Slug is auto-generated from name.
 */
export type ProjectInput = Omit<
  Project,
  "id" | "slug" | "createdAt" | "updatedAt"
>;
