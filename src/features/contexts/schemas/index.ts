import { z } from "zod";

/**
 * Validation schema for a context ID
 */
export const contextIdSchema = z.string().uuid("Invalid context ID format");

/**
 * Validation schema for creating a new context.
 */
export const createContextSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format"),
  name: z
    .string()
    .min(1, "Context name is required")
    .max(100, "Context name must be 100 characters or less")
    .trim(),
  tags: z.array(z.string()).default([]),
  markdown: z.string().min(1, "Initial content is required"),
});

/**
 * Inferred type from create context schema
 */
export type CreateContextInput = z.infer<typeof createContextSchema>;

/**
 * Validation schema for saving a new version of a context.
 */
export const saveVersionSchema = z.object({
  contextId: z.string().uuid("Invalid context ID format"),
  markdown: z.string().min(1, "Content cannot be empty"),
});

/**
 * Inferred type from save version schema
 */
export type SaveVersionInput = z.infer<typeof saveVersionSchema>;

/**
 * Validation schema for updating a context (name, tags, and content).
 * Creates a new version on save.
 */
export const updateContextSchema = z.object({
  contextId: z.string().uuid("Invalid context ID format"),
  name: z
    .string()
    .min(1, "Context name is required")
    .max(100, "Context name must be 100 characters or less")
    .trim(),
  tags: z.array(z.string()).default([]),
  markdown: z.string().min(1, "Content cannot be empty"),
});

/**
 * Inferred type from update context schema
 */
export type UpdateContextInput = z.infer<typeof updateContextSchema>;
