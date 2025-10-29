-- Cleanup script: Remove existing RLS policies if migration was partially run
-- Run this FIRST before running 001_init.sql again

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team members can access projects" ON projects;

-- This script is safe to run multiple times
-- It won't error if policies don't exist

