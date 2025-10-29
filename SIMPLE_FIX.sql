-- Simple Fix: Just create the required data
-- Copy this ENTIRE file and paste into Supabase SQL Editor

-- Create default team and user for development
INSERT INTO users (id, email, name, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@aura.studio',
  'Demo User',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO teams (id, name, owner_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'AURA Studio',
  '11111111-1111-1111-1111-111111111111',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO team_members (id, team_id, user_id, role, status, joined_at, created_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Done! Now try creating a project again.

