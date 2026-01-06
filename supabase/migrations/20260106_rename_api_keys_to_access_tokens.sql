-- Rename api_keys table to access_tokens
-- Also update column key_hash to token_hash for consistency

-- Step 1: Rename the table
ALTER TABLE api_keys RENAME TO access_tokens;

-- Step 2: Rename the key_hash column to token_hash
ALTER TABLE access_tokens RENAME COLUMN key_hash TO token_hash;

-- Step 3: Update indexes (drop and recreate with new names)
DROP INDEX IF EXISTS idx_api_keys_user_id;
DROP INDEX IF EXISTS idx_api_keys_key_hash;

CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token_hash ON access_tokens(token_hash) WHERE revoked_at IS NULL;

-- Step 4: Update RLS policies (drop old and create new)
DROP POLICY IF EXISTS "Users can view own API keys" ON access_tokens;
DROP POLICY IF EXISTS "Users can create own API keys" ON access_tokens;
DROP POLICY IF EXISTS "Users can update own API keys" ON access_tokens;
DROP POLICY IF EXISTS "Users can delete own API keys" ON access_tokens;

CREATE POLICY "Users can view own access tokens"
  ON access_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own access tokens"
  ON access_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own access tokens"
  ON access_tokens
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own access tokens"
  ON access_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Update trigger function and trigger
DROP TRIGGER IF EXISTS api_keys_updated_at ON access_tokens;
DROP FUNCTION IF EXISTS update_api_keys_updated_at();

CREATE OR REPLACE FUNCTION update_access_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER access_tokens_updated_at
  BEFORE UPDATE ON access_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_access_tokens_updated_at();
