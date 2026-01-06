/**
 * Context entity representing a curated AI context.
 * PURE TYPE: No I/O, no side effects, no Date objects.
 */
export type Context = {
  id: string;
  projectId: string;
  name: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

/**
 * Input type for creating a new Context.
 * Excludes auto-generated fields.
 */
export type ContextInput = Omit<Context, "id" | "createdAt" | "updatedAt">;

/**
 * ContextVersion entity representing a saved version of context.
 * Versions are immutable once created.
 * Order/Latest determined by createdAt (no version number).
 */
export type ContextVersion = {
  id: string;
  contextId: string;
  name: string | null;
  tags: string[] | null;
  markdown: string;
  createdAt: string; // ISO string
};

/**
 * Input type for creating a new ContextVersion.
 * Excludes auto-generated fields.
 */
export type ContextVersionInput = Omit<ContextVersion, "id" | "createdAt">;
