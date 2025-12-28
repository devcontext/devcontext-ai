/**
 * Project entity - container for user data.
 * PURE TYPE: No I/O, no side effects.
 */
export type Project = {
  id: string
  ownerUserId: string
  name: string
  stackPresetId: string | null
  activeRulesetId: string | null
  ruleToggles: Record<string, boolean>
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

/**
 * Input type for creating a new Project.
 */
export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
