-- Storyboard Analyses Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS storyboard_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text,
  overall_description text,
  scenes jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_storyboard_analyses_project_id ON storyboard_analyses(project_id);

-- Comments
COMMENT ON TABLE storyboard_analyses IS 'Stores AI-generated storyboard scene breakdowns';
COMMENT ON COLUMN storyboard_analyses.scenes IS 'Array of scene objects with number, title, description, location, timeOfDay, characters, imagePrompt, videoPrompt';
COMMENT ON COLUMN storyboard_analyses.metadata IS 'Overall metadata like tones, mood, visualStyle, totalScenes';
