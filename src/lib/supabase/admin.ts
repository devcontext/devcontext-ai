import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client that bypasses Row Level Security (RLS).
 *
 * ⚠️ WARNING: Use ONLY for administrative operations that require bypassing RLS:
 * - Creating users programmatically (admin.createUser())
 * - Data migrations
 * - Audit operations
 * - Background jobs without user context
 *
 * For user operations, use createSupabaseServerClient from features/core/infra/supabase-server.ts
 * or createSupabaseBrowserClient from lib/supabase/client.ts
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
