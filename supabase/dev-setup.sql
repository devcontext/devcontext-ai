-- ============================================================
-- ⚠️  DEV SETUP — LOCAL ONLY ⚠️
-- ============================================================
-- Purpose: Disable RLS for local development until Auth is implemented.
-- 
-- Run this in your Supabase SQL Editor to allow CRUD without auth.users.
-- ============================================================

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE sources DISABLE ROW LEVEL SECURITY;
ALTER TABLE contexts DISABLE ROW LEVEL SECURITY;
ALTER TABLE context_versions DISABLE ROW LEVEL SECURITY;

-- Note: When Auth is ready, you should re-enable RLS:
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ... etc.
