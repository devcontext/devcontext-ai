"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import {
  createContextSchema,
  saveVersionSchema,
  contextIdSchema,
} from "../schemas";
import {
  handleErrorResponse,
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/features/shared/utils/error-handler";
import {
  isNotFoundError,
  isForbiddenError,
} from "@/features/core/domain/errors";
import type { ApiResponse } from "@/features/shared/types/api-response";
import type {
  Context,
  ContextVersion,
} from "@/features/core/domain/types/contexts";
import type { ContextDetails } from "../services/get-context";
import { withAppContext } from "@/features/core/app/context/app-context";
import { ContextsRepository } from "@/features/core/infra/db/contexts-repository";
import {
  createContext,
  getContext,
  listContexts,
  restoreVersion,
  saveVersion,
  deleteContext,
} from "@/features/contexts/services";
import { appRoutes } from "@/features/routes";

/**
 * Action to list contexts
 */
export async function listContextsAction(
  projectId?: string,
): Promise<ApiResponse<Context[]>> {
  try {
    const contexts = await listContexts({ projectId });
    return successResponse(contexts);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Action to get context details
 */
export async function getContextAction(
  contextId: string,
): Promise<ApiResponse<ContextDetails | null>> {
  try {
    const validation = contextIdSchema.safeParse(contextId);
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message);
    }

    const context = await getContext(validation.data);
    return successResponse(context);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Action to create a new context
 */
export async function createContextAction(
  input: unknown,
): Promise<ApiResponse<Context & { initialVersion: ContextVersion }>> {
  try {
    const validation = createContextSchema.safeParse(input);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const result = await createContext(validation.data);

    revalidatePath(appRoutes.home.path, "layout");

    return successResponse(result);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Action to save a new version
 */
export async function saveVersionAction(
  input: unknown,
): Promise<ApiResponse<ContextVersion>> {
  try {
    const validation = saveVersionSchema.safeParse(input);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const version = await saveVersion(validation.data);

    revalidatePath(appRoutes.home.path, "layout");

    return successResponse(version);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Action to restore a version
 */
export async function restoreVersionAction(
  versionId: string,
): Promise<ApiResponse<ContextVersion>> {
  try {
    const validation = contextIdSchema.safeParse(versionId);
    if (!validation.success) {
      return errorResponse("Invalid version ID");
    }

    const version = await restoreVersion(validation.data);

    revalidatePath(appRoutes.home.path, "layout");

    return successResponse(version);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

/**
 * Action to delete a context
 */
export async function deleteContextAction(
  contextId: string,
): Promise<ApiResponse<void>> {
  try {
    const validation = contextIdSchema.safeParse(contextId);
    if (!validation.success) {
      return errorResponse("Invalid context ID");
    }

    await deleteContext(validation.data);

    revalidatePath(appRoutes.home.path, "layout");
    return successResponse(undefined);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
