# 🚀 Supabase Setup Guide

## The Issue

You're seeing the loading animation because the Supabase database hasn't been set up yet. The app is trying to connect to a database that doesn't exist yet.

## ✅ Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Migration

1. Copy ALL the content from `db/migrations/001_init.sql`
2. Paste it into the Supabase SQL Editor
3. Click **Run** (bottom right)
4. Wait for it to complete

### Step 3: Create Storage Bucket

In the SQL Editor, run this command:

```sql
-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('aura-assets', 'aura-assets', true);
```

### Step 4: Verify Environment Variables

Make sure your `.env.local` file has these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ekjjgsiilbljlxebkazx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

### Step 6: Try Again

Now try creating a project - it should work! 🎉

---

## 🔍 Troubleshooting

### Error: "relation 'projects' does not exist"

**Solution**: The migration hasn't been run yet. Go to Step 2 above.

### Error: "permission denied for table"

**Solution**: You may need to adjust RLS policies. For now, disable RLS temporarily:

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
```

### Error: "Network error"

**Solution**: 
1. Check your `.env.local` file exists
2. Restart the dev server after changing environment variables
3. Check that you're using the correct Supabase project

### Still not working?

Check the browser console (F12 → Console tab) for detailed error messages.

---

## 📊 What Gets Created

Running the migration creates these tables:

- ✅ `users`
- ✅ `teams`
- ✅ `team_members`
- ✅ `projects`
- ✅ `project_blocks`
- ✅ `scenes`
- ✅ `shots`
- ✅ `tasks`
- ✅ `assets`
- ✅ `ai_requests`
- ✅ `comments`
- ✅ `revisions`

Plus indexes for performance!

---

## 🎬 Next Steps

Once the database is set up:

1. Create your first project
2. It will appear in the dashboard
3. Start adding scenes, shots, and tasks

Happy filming! 🎬✨

