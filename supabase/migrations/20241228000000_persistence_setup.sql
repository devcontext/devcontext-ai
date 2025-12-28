-- ============================================================
-- Migration: Persistence Setup (MVP)
-- Created: 2024-12-28
-- Description: Creates all tables for Context Composer MVP
--   - projects: container for all user data (owner-scoped)
--   - sources: uploaded files / pasted text
--   - contexts: curated AI context containers
--   - context_versions: immutable version history
-- ============================================================

-- ============================================================
-- 0. PROJECTS TABLE (Owner-scoped MVP)
-- ============================================================
-- MVP Decision: owner_user_id for owner-scoped access.
-- Future: Add workspace_id + memberships for team support.

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stack_preset_id TEXT,
  active_ruleset_id TEXT,
  rule_toggles JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_user_id);

-- RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_owner" ON projects
  FOR SELECT USING (owner_user_id = auth.uid());

CREATE POLICY "projects_insert_owner" ON projects
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "projects_update_owner" ON projects
  FOR UPDATE USING (owner_user_id = auth.uid());

CREATE POLICY "projects_delete_owner" ON projects
  FOR DELETE USING (owner_user_id = auth.uid());

-- ============================================================
-- 1. SOURCES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'text')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sources_project_id ON sources(project_id);

-- ============================================================
-- 2. CONTEXTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contexts_project_id ON contexts(project_id);

-- Unique constraint: Context name must be unique per project (PRD requirement)
CREATE UNIQUE INDEX IF NOT EXISTS uq_contexts_project_name ON contexts(project_id, name);

-- GIN index for tag filtering
CREATE INDEX IF NOT EXISTS idx_contexts_tags ON contexts USING GIN(tags);

-- ============================================================
-- 3. CONTEXT_VERSIONS TABLE
-- ============================================================
-- NOTE: No version_number. Latest = ORDER BY created_at DESC LIMIT 1

CREATE TABLE IF NOT EXISTS context_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id UUID NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
  markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_context_versions_context_id ON context_versions(context_id);
CREATE INDEX IF NOT EXISTS idx_context_versions_created_at ON context_versions(created_at DESC);

-- ============================================================
-- 4. RLS POLICIES (sources, contexts, context_versions)
-- ============================================================
-- Access granted if project belongs to authenticated user

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_versions ENABLE ROW LEVEL SECURITY;

-- SOURCES
CREATE POLICY "sources_select_owner" ON sources
  FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

CREATE POLICY "sources_insert_owner" ON sources
  FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

CREATE POLICY "sources_delete_owner" ON sources
  FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

-- CONTEXTS
CREATE POLICY "contexts_select_owner" ON contexts
  FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

CREATE POLICY "contexts_insert_owner" ON contexts
  FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

CREATE POLICY "contexts_update_owner" ON contexts
  FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

CREATE POLICY "contexts_delete_owner" ON contexts
  FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid()));

-- CONTEXT_VERSIONS
CREATE POLICY "context_versions_select_owner" ON context_versions
  FOR SELECT
  USING (
    context_id IN (
      SELECT id FROM contexts 
      WHERE project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid())
    )
  );

CREATE POLICY "context_versions_insert_owner" ON context_versions
  FOR INSERT
  WITH CHECK (
    context_id IN (
      SELECT id FROM contexts 
      WHERE project_id IN (SELECT id FROM projects WHERE owner_user_id = auth.uid())
    )
  );

-- ============================================================
-- 5. TRIGGERS (idempotent)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Projects updated_at
DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Contexts updated_at
DROP TRIGGER IF EXISTS trigger_contexts_updated_at ON contexts;
CREATE TRIGGER trigger_contexts_updated_at
  BEFORE UPDATE ON contexts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- END OF MIGRATION
-- ============================================================
