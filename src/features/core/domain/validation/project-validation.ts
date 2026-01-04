import { z } from "zod";

/**
 * Validation schema for creating a new project.
 * Used on both client (react-hook-form) and server (action validation).
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less")
    .trim(),
  stackPresetId: z.string().nullable().optional(),
  activeRulesetId: z.string().nullable().optional(),
  ruleToggles: z.record(z.string(), z.boolean()).optional(),
});

/**
 * Inferred type from create project schema
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Validation schema for updating a project.
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less")
    .trim()
    .optional(),
  stackPresetId: z.string().nullable().optional(),
  activeRulesetId: z.string().nullable().optional(),
  ruleToggles: z.record(z.string(), z.boolean()).optional(),
});

/**
 * Inferred type from update project schema
 */
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
