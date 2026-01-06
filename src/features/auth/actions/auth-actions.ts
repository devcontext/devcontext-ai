"use server";

import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  handleErrorResponse,
  successResponse,
} from "@/features/shared/utils/error-handler";
import type { ApiResponse } from "@/features/shared/types/api-response";
import { appRoutes } from "@/features/routes";

/**
 * Server action to log in a user
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Redirect to app on success
    revalidatePath(appRoutes.home.path, "layout");
    redirect(appRoutes.home.path);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return handleErrorResponse(error);
  }
}

/**
 * Server action to sign up a new user
 */
export async function signupAction(
  email: string,
  password: string,
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Redirect to app on success
    revalidatePath(appRoutes.home.path, "layout");
    redirect(appRoutes.home.path);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return handleErrorResponse(error);
  }
}

/**
 * Server action to log out the current user
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(appRoutes.auth.login.path);
}
