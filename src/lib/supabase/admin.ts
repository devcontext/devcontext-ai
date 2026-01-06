import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client that bypasses Row Level Security (RLS).
 *
 * ⚠️ WARNING: Use ONLY for administrative operations that require bypassing RLS:
 * - Creating users programmatically (admin.createUser())
 * - Data migrations
 * - Audit operations
 * - Background jobs without user context
 * - **MCP token authentication** (tokens are validated before user context exists)
 */

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Primary: Server-side secret key (recommended)
  // Fallback: Legacy service role key
  const adminKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!adminKey) {
    console.error(
      "⚠️ CRITICAL: Supabase Admin Key (SUPABASE_SECRET_KEY) not configured. " +
        "MCP authentication will NOT work.",
    );
    // Last resort fallback (subject to RLS)
    const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!fallbackKey) {
      throw new Error("No valid Supabase API keys found in environment");
    }
    return createClient(supabaseUrl, fallbackKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = createSupabaseAdmin();
