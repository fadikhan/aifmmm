# 🔒 Fix for RLS Policy Error

## The Problem

You're seeing: `new row violates row-level security policy for table "projects"`

This means Row Level Security is enabled but doesn't allow inserts.

## ✅ Quick Fix (Choose One)

### Option 1: Disable RLS (Easiest for Development)

Run this in Supabase SQL Editor:

```sql
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE shots DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE revisions DISABLE ROW LEVEL SECURITY;
```

**Then try creating a project again - it should work! ✅**

### Option 2: Allow All Operations (Keep RLS Enabled)

If you want to keep RLS enabled but allow all operations:

```sql
-- Drop existing policies first
DROP POLICY IF EXISTS "Team members can access projects" ON projects;
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;

-- Create permissive policies
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on teams" ON teams
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Option 3: Use Service Role Key (Bypasses RLS)

Update your `.env.local` to use the service role key temporarily:

```bash
# Change from anon key to service role key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then update `lib/supabaseClient.ts` to use service role for writes.

---

## 🎯 Recommended: Option 1

For development, **just disable RLS** on all tables. This is the simplest solution.

1. Copy the SQL from `db/migrations/003_disable_rls.sql`
2. Paste into Supabase SQL Editor
3. Click **Run**
4. Try creating a project again

---

## 🔍 Why This Happened

RLS (Row Level Security) is enabled but there's no policy that allows creating projects. The migration commented out RLS policies, but they might have been enabled from a previous run.

---

## ✅ After the Fix

Create a project - it should work now! 🎉

**Note**: For production, you'll want to set up proper RLS policies with user authentication. But for development, disabling RLS is fine.

