import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser/client-side operations.
 * Use this in "use client" components.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
