-- ============================================
-- AIFS - COMPLETE DATABASE MIGRATION
-- Run this ONCE in your Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- 1. STORYBOARD ANALYSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS storyboard_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text,
  overall_description text,
  scenes jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for storyboard_analyses
CREATE INDEX IF NOT EXISTS idx_storyboard_analyses_project_id 
  ON storyboard_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_analyses_created_at 
  ON storyboard_analyses(created_at DESC);

-- Comments
COMMENT ON TABLE storyboard_analyses IS 'Stores AI-generated storyboard scene breakdowns';
COMMENT ON COLUMN storyboard_analyses.scenes IS 'Array of scene objects with number, title, description, location, timeOfDay, characters, imagePrompt, videoPrompt';
COMMENT ON COLUMN storyboard_analyses.metadata IS 'Overall metadata like tones, mood, visualStyle, totalScenes';

-- ============================================
-- 2. VIDEO COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_color text NOT NULL,
  timestamp_seconds numeric NOT NULL,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for video_comments
CREATE INDEX IF NOT EXISTS idx_video_comments_asset_id 
  ON video_comments(asset_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_project_id 
  ON video_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_timestamp 
  ON video_comments(timestamp_seconds);
CREATE INDEX IF NOT EXISTS idx_video_comments_asset_timestamp 
  ON video_comments(asset_id, timestamp_seconds);

-- Comments
COMMENT ON TABLE video_comments IS 'Timestamp-based comments on video assets for team review';
COMMENT ON COLUMN video_comments.timestamp_seconds IS 'Video timestamp where comment was added (in seconds)';
COMMENT ON COLUMN video_comments.user_color IS 'Hex color assigned to user for visual distinction';

-- ============================================
-- 3. ADD MISSING INDEXES TO EXISTING TABLES
-- ============================================

-- Assets table indexes
CREATE INDEX IF NOT EXISTS idx_assets_project_id 
  ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_type 
  ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_project_type 
  ON assets(project_id, type);
CREATE INDEX IF NOT EXISTS idx_assets_created_at 
  ON assets(created_at DESC);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_team_id 
  ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status 
  ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by 
  ON projects(created_by);

-- Scenes table indexes
CREATE INDEX IF NOT EXISTS idx_scenes_project_id 
  ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order 
  ON scenes(project_id, order_index);

-- Shots table indexes
CREATE INDEX IF NOT EXISTS idx_shots_scene_id 
  ON shots(scene_id);
CREATE INDEX IF NOT EXISTS idx_shots_order 
  ON shots(scene_id, order_index);

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id 
  ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status 
  ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee 
  ON tasks(assignee_id);

-- AI requests table indexes
CREATE INDEX IF NOT EXISTS idx_ai_requests_project_id 
  ON ai_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id 
  ON ai_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_created_at 
  ON ai_requests(created_at DESC);

-- Team members table indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id 
  ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id 
  ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status 
  ON team_members(status);

-- ============================================
-- 4. STORAGE BUCKET POLICIES (For aura-assets bucket)
-- ============================================

-- Note: RLS policies removed for development
-- Add them back when authentication is implemented

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on aura-assets" ON storage.objects;

-- Allow all operations on aura-assets bucket
CREATE POLICY "Allow all operations on aura-assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'aura-assets')
  WITH CHECK (bucket_id = 'aura-assets');

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_storyboard_analyses_updated_at ON storyboard_analyses;
CREATE TRIGGER update_storyboard_analyses_updated_at
  BEFORE UPDATE ON storyboard_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_comments_updated_at ON video_comments;
CREATE TRIGGER update_video_comments_updated_at
  BEFORE UPDATE ON video_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Run these to verify everything was created successfully:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('storyboard_analyses', 'video_comments')
ORDER BY table_name;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('storyboard_analyses', 'video_comments', 'assets', 'projects')
ORDER BY tablename, indexname;

-- Check storage policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- ============================================
-- MIGRATION COMPLETE! ✅
-- ============================================

-- Summary:
-- ✅ Created storyboard_analyses table
-- ✅ Created video_comments table
-- ✅ Added 20+ performance indexes
-- ✅ Added storage bucket policies
-- ✅ Created helper functions and triggers
-- ⚠️ RLS disabled for development (add back when auth is ready)
