"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/utils/get-user";
import { projectsRepository } from "@/features/core/infra/db/projects-repository";
import { createProjectSchema } from "@/features/core/domain/validation/project-validation";
import type { Project } from "@/features/core/domain/types/projects";

export type ActionResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Server action to list all projects for the authenticated user
 */
export async function listProjectsAction(): Promise<ActionResponse<Project[]>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Fetch projects for this user
    const projects = await projectsRepository.getByOwnerId(user.id);

    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    console.error("Error listing projects:", error);
    return {
      success: false,
      error: "Failed to load projects. Please try again.",
    };
  }
}

/**
 * Server action to create a new project
 */
export async function createProjectAction(
  input: unknown,
): Promise<ActionResponse<Project>> {
  try {
    // Get authenticated user (redirects to login if not authenticated)
    const user = await requireUser();

    // Validate input with Zod schema
    const validation = createProjectSchema.safeParse(input);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Invalid project data",
      };
    }

    const validatedData = validation.data;

    // Create project input with user ID
    const projectInput = {
      ownerUserId: user.id,
      name: validatedData.name,
      stackPresetId: validatedData.stackPresetId ?? null,
      activeRulesetId: validatedData.activeRulesetId ?? null,
      ruleToggles: (validatedData.ruleToggles ?? {}) as Record<string, boolean>,
    };

    // Create project in database
    const project = await projectsRepository.create(projectInput);

    if (!project) {
      return {
        success: false,
        error: "Failed to create project. Please try again.",
      };
    }

    // Revalidate paths that display projects
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contexts");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the project.",
    };
  }
}

/**
 * Server action to get a single project by ID
 */
export async function getProjectAction(
  projectId: string,
): Promise<ActionResponse<Project>> {
  try {
    // Get authenticated user
    const user = await requireUser();

    // Validate input
    if (!projectId || projectId.trim().length === 0) {
      return {
        success: false,
        error: "Project ID is required",
      };
    }

    // Fetch project
    const project = await projectsRepository.getById(projectId);

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Verify ownership (RLS should handle this, but extra check)
    if (project.ownerUserId !== user.id) {
      return {
        success: false,
        error: "You do not have access to this project",
      };
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      error: "Failed to load project. Please try again.",
    };
  }
}
