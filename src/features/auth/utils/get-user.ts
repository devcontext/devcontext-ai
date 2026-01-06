import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import { redirect } from "next/navigation";
import { appRoutes } from "@/features/routes";

/**
 * Get the currently authenticated user (server-side)
 * @returns User object or null if not authenticated
 */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 * @returns User object (guaranteed to exist)
 */
export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect(appRoutes.auth.login.path);
  }

  return user;
}
