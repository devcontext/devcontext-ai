-- Quick debug script to check API keys
-- Run this in Supabase SQL Editor

-- Check all api_keys
SELECT 
  id,
  user_id,
  name,
  substring(key_hash, 1, 20) as hash_preview,
  created_at,
  revoked_at
FROM api_keys
ORDER BY created_at DESC
LIMIT 5;

-- Check if the specific hash exists
-- Replace with the actual hash from the node command above
SELECT 
  id,
  user_id,
  name,
  revoked_at
FROM api_keys
WHERE key_hash = 'REPLACE_WITH_HASH_FROM_NODE_COMMAND'
LIMIT 1;
