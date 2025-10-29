-- Corrected Simple Fix: Create the required data
-- Copy this ENTIRE file and paste into Supabase SQL Editor

-- Create default user
INSERT INTO users (id, email, name)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@aura.studio',
  'Demo User'
)
ON CONFLICT (id) DO NOTHING;

-- Create default team
INSERT INTO teams (id, name, owner_id)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'AURA Studio',
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

-- Create team membership (without created_at column)
INSERT INTO team_members (id, team_id, user_id, role, status)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Done! Now try creating a project again.

