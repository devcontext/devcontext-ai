"use server";

import { revalidatePath } from "next/cache";
import { listProjects } from "@/features/projects/services/list-projects";
import { createProject } from "@/features/projects/services/create-project";
import { getProject } from "@/features/projects/services/get-project";
import {
  createProjectSchema,
  projectIdSchema,
} from "@/features/projects/schemas";
import type { Project } from "@/features/core/domain/types/projects";
import {
  errorResponse,
  handleErrorResponse,
  successResponse,
} from "@/features/shared/utils/error-handler";
import type { ApiResponse } from "@/features/shared/types/api-response";

/**
 * Server action to list all projects for the authenticated user
 */
export async function listProjectsAction(): Promise<ApiResponse<Project[]>> {
  try {
    const projects = await listProjects();
    return successResponse(projects);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to create a new project
 */
export async function createProjectAction(
  input: unknown,
): Promise<ApiResponse<Project>> {
  try {
    // 1. Validate input with Zod schema
    const validation = createProjectSchema.safeParse(input);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(firstError?.message || "Invalid project data");
    }

    const validatedData = validation.data;

    // 2. Call service
    const project = await createProject({
      name: validatedData.name,
      stackPresetId: validatedData.stackPresetId ?? null,
      activeRulesetId: validatedData.activeRulesetId ?? null,
      ruleToggles: (validatedData.ruleToggles ?? {}) as Record<string, boolean>,
    });

    // 3. Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contexts");
    revalidatePath("/dashboard/settings");

    return successResponse(project);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Server action to get a single project by ID
 */
export async function getProjectAction(
  projectId: string,
): Promise<ApiResponse<Project>> {
  try {
    const validation = projectIdSchema.safeParse(projectId);
    if (!validation.success) {
      return errorResponse("Invalid project ID");
    }

    const project = await getProject(validation.data);
    return successResponse(project);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
