-- Fix RLS for Assets Table
-- Run this in Supabase SQL Editor to allow asset uploads

-- Disable RLS on assets table (for development)
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;

-- Also disable on other tables that might need inserts
ALTER TABLE ai_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow all operations:
-- Uncomment below and comment out the DISABLE commands above

-- CREATE POLICY "Allow all operations on assets" ON assets
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Allow all operations on ai_requests" ON ai_requests
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Allow all operations on comments" ON comments
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

