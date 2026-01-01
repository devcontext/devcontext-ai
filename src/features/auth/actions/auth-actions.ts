"use server";

import { createClient } from "@/features/core/infra/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Server action to log in a user
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<LoginResult> {
  const supabase = await createClient();

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

  // Redirect to dashboard on success
  redirect("/dashboard/contexts");
}

/**
 * Server action to sign up a new user
 */
export async function signupAction(
  email: string,
  password: string,
): Promise<LoginResult> {
  const supabase = await createClient();

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

  // Redirect to dashboard on success
  redirect("/dashboard/contexts");
}

/**
 * Server action to log out the current user
 */
export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
