import { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "../../infra/supabase-server";

/**
 * Application context per request
 * Contains: Supabase client + authenticated userId
 *
 * This ensures the Supabase client is created ONCE per request
 * and shared across all services/repositories (Data Fetching Rule #6-10)
 */
export interface AppContext {
  supabase: SupabaseClient;
  userId: string;
}

/**
 * Wrapper that creates the application context and passes it to the function
 *
 * Usage in services:
 * ```ts
 * export async function listProjects(): Promise<Project[]> {
 *   return withAppContext(async (ctx) => {
 *     const repo = new ProjectsRepository(ctx.supabase);
 *     return repo.getByOwnerId(ctx.userId);
 *   });
 * }
 * ```
 */
export async function withAppContext<T>(
  fn: (ctx: AppContext) => Promise<T>,
): Promise<T> {
  // 1. Create Supabase client ONCE per request
  const supabase = await createSupabaseServerClient();

  // 2. Get authenticated user (redirects if not authenticated)
  const user = await requireUser();

  // 3. Create context
  const ctx: AppContext = {
    supabase,
    userId: user.id,
  };

  // 4. Execute function with context
  return fn(ctx);
}
