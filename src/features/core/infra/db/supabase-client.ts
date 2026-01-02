import { createClient } from "@supabase/supabase-js";

/**
 * Legacy admin client for database repositories.
 * This uses SECRET_KEY to bypass RLS for repository operations.
 *
 * Note: This file is kept for backward compatibility with existing repositories.
 * New code should use @/lib/supabase/admin instead.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
  );
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Alias for clarity
export const supabaseAdmin = supabase;
