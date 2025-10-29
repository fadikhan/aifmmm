-- Disable RLS for development (quick fix)
-- Run this after 001_init.sql if you get RLS errors

-- Disable RLS on tables
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE shots DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE revisions DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled, add permissive policies:

-- Allow all operations for now (development only)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on teams" ON teams
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on team_members" ON team_members
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on scenes" ON scenes
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

