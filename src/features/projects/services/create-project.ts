import { withAppContext } from "@/features/core/app/context/app-context";
import { ProjectsRepository } from "@/features/core/infra/db/projects-repository";
import type {
  Project,
  ProjectInput,
} from "@/features/core/domain/types/projects";

/**
 * Generates a URL-safe slug from a project name.
 * Converts to lowercase, replaces spaces and special chars with dashes.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Internal type for repository create that includes generated slug
 */
type CreateProjectData = ProjectInput & { slug: string };

/**
 * Service: Create a new project
 *
 * DATA FETCHING PATTERN (Rule #11-12):
 * - Service encapsulates withAppContext internally
 * - Receives project data WITHOUT ownerUserId (auto-injected from context)
 * - Service creates repository with shared Supabase client
 * - Generates slug from project name
 */
export async function createProject(
  input: Omit<ProjectInput, "ownerUserId">,
): Promise<Project> {
  return withAppContext(async (ctx) => {
    const repo = new ProjectsRepository(ctx.supabase);
    const slug = generateSlug(input.name);

    const createData: CreateProjectData = {
      ...input,
      slug,
      ownerUserId: ctx.userId,
    };

    return repo.create(createData);
  });
}
