-- Video Comments Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_color text NOT NULL, -- hex color for the user
  timestamp_seconds numeric NOT NULL, -- video timestamp in seconds
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_video_comments_asset_id ON video_comments(asset_id);
CREATE INDEX idx_video_comments_project_id ON video_comments(project_id);
CREATE INDEX idx_video_comments_timestamp ON video_comments(timestamp_seconds);

-- Comments
COMMENT ON TABLE video_comments IS 'Timestamp-based comments on video assets for team review';
COMMENT ON COLUMN video_comments.timestamp_seconds IS 'Video timestamp where comment was added (in seconds)';
COMMENT ON COLUMN video_comments.user_color IS 'Hex color assigned to user for visual distinction';
