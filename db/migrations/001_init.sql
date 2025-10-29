-- AURA Studio Database Schema
-- Run this migration on your Supabase PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members (with roles)
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer',
  -- roles: owner, admin, director, writer, vfx, editor, viewer
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  status text DEFAULT 'pending', -- pending, active, archived
  UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'draft', -- draft, active, complete, archived
  settings jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project blocks (Notion-like blocks)
CREATE TABLE IF NOT EXISTS project_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL, -- section, text, image, shotlist, task, kanban, storyboard
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  parent_id uuid REFERENCES project_blocks(id) ON DELETE CASCADE,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text, -- script text/markup
  metadata jsonb DEFAULT '{}'::jsonb,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shots table (from shotlists)
CREATE TABLE IF NOT EXISTS shots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid REFERENCES scenes(id) ON DELETE CASCADE,
  shot_number int,
  camera text, -- close-up, wide, medium, etc.
  movement text, -- static, pan, zoom, dolly, etc.
  duration text, -- estimated duration
  notes text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tasks (Kanban board items)
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  scene_id uuid REFERENCES scenes(id) ON DELETE SET NULL,
  shot_id uuid REFERENCES shots(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo', -- todo, in-progress, review, done
  priority text DEFAULT 'medium', -- low, medium, high
  assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  due_date timestamptz,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets (files uploaded to Supabase Storage)
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  type text NOT NULL, -- image, video, audio, document, other
  filename text,
  size bigint,
  mime_type text,
  metadata jsonb DEFAULT '{}'::jsonb, -- tags, ai_analysis, etc.
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI requests tracking
CREATE TABLE IF NOT EXISTS ai_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id),
  type text NOT NULL, -- generate, storyboard, shotlist, rewrite, summarize
  prompt text,
  response jsonb,
  cost_estimate numeric DEFAULT 0,
  model text,
  status text DEFAULT 'pending', -- pending, success, error
  error text,
  created_at timestamptz DEFAULT now()
);

-- Comments (on scenes, blocks, tasks)
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  target_type text NOT NULL, -- scene, task, block
  target_id uuid NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revisions (versioning)
CREATE TABLE IF NOT EXISTS revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  target_type text NOT NULL, -- scene, block
  target_id uuid NOT NULL,
  content text NOT NULL,
  version int NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_team ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_project_blocks_project ON project_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_project ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_shots_scene ON shots(scene_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_project ON ai_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_revisions_target ON revisions(target_type, target_id);

-- Row Level Security (RLS) policies (basic examples)
-- Note: Adjust these based on your Supabase RLS setup
-- Uncomment below to enable RLS (currently disabled for easier development)

-- Teams: Users can only see teams they're members of
-- ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
-- CREATE POLICY "Users can view teams they belong to" ON teams
--   FOR SELECT USING (
--     id IN (
--       SELECT team_id FROM team_members WHERE user_id = auth.uid()
--     )
--   );

-- Projects: Team members can access
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Team members can access projects" ON projects;
-- CREATE POLICY "Team members can access projects" ON projects
--   FOR ALL USING (
--     team_id IN (
--       SELECT team_id FROM team_members WHERE user_id = auth.uid()
--     )
--   );

-- Add more RLS policies as needed for other tables

