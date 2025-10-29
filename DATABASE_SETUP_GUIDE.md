# 🗄️ AIFS Database Setup Guide

## Quick Start

### 1. Run the Complete Migration

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/ekjjgsiilbljlxebkazx

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste**
   - Open `db/migrations/COMPLETE_MIGRATION.sql`
   - Copy ALL the content
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" or press `Ctrl+Enter`
   - Wait for "Success" message

### 2. Verify Installation

Run these verification queries in SQL Editor:

```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('storyboard_analyses', 'video_comments')
ORDER BY table_name;

-- Should return:
-- storyboard_analyses
-- video_comments
```

```sql
-- Check indexes were created
SELECT COUNT(*) as index_count
FROM pg_indexes 
WHERE schemaname = 'public';

-- Should return: 20+ indexes
```

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- Should show multiple tables with RLS enabled
```

## What This Migration Does

### ✅ Tables Created
1. **storyboard_analyses** - Stores AI-generated scene breakdowns
2. **video_comments** - Stores timestamp-based video review comments

### ✅ Indexes Added (20+)
Performance indexes on:
- `assets` (project_id, type, created_at)
- `projects` (team_id, status, created_by)
- `scenes` (project_id, order_index)
- `shots` (scene_id, order_index)
- `tasks` (project_id, status, assignee_id)
- `ai_requests` (project_id, user_id, created_at)
- `team_members` (team_id, user_id, status)
- `storyboard_analyses` (project_id, created_at)
- `video_comments` (asset_id, project_id, timestamp_seconds)

### ✅ Security Enabled
- **Row Level Security (RLS)** enabled on all tables
- **Policies** created to restrict access by team membership
- **Storage policies** for file uploads

### ✅ Helper Functions
- `update_updated_at_column()` - Auto-updates timestamps
- Triggers on `storyboard_analyses` and `video_comments`

## Troubleshooting

### Error: "relation already exists"
This is OK! It means the table was already created. The migration uses `IF NOT EXISTS` so it's safe to run multiple times.

### Error: "permission denied"
Make sure you're using the Supabase SQL Editor (not a client connection). The SQL Editor has admin privileges.

### Error: "foreign key constraint"
This means a referenced table doesn't exist. Make sure you ran the initial migration (`001_init.sql`) first.

### RLS Blocking Access
If you can't access data after enabling RLS:

```sql
-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE storyboard_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_comments DISABLE ROW LEVEL SECURITY;

-- Or create a bypass policy for development
CREATE POLICY "Allow all for development"
  ON storyboard_analyses FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Testing the Migration

### Test 1: Create a Storyboard Analysis
```sql
INSERT INTO storyboard_analyses (project_id, filename, overall_description, scenes)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'test-script.docx',
  'Test scene breakdown',
  '[{"number": 1, "title": "Opening", "description": "Test scene"}]'::jsonb
);

-- Should succeed
```

### Test 2: Create a Video Comment
```sql
INSERT INTO video_comments (
  asset_id, 
  project_id, 
  user_name, 
  user_color, 
  timestamp_seconds, 
  comment_text
)
VALUES (
  (SELECT id FROM assets LIMIT 1),
  '33333333-3333-3333-3333-333333333333',
  'Test User',
  '#FF6B6B',
  10.5,
  'Great shot!'
);

-- Should succeed
```

### Test 3: Check Indexes
```sql
EXPLAIN ANALYZE
SELECT * FROM assets 
WHERE project_id = '33333333-3333-3333-3333-333333333333' 
  AND type = 'video';

-- Should show "Index Scan" (not "Seq Scan")
```

## Next Steps

After running this migration:

1. ✅ **Test the app** - Try uploading videos and saving storyboards
2. ✅ **Check performance** - Queries should be faster with indexes
3. ✅ **Verify security** - Make sure RLS policies work correctly
4. ⚠️ **Implement authentication** - RLS only works with authenticated users
5. ⚠️ **Add API middleware** - Protect API routes with auth checks

## Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Drop new tables
DROP TABLE IF EXISTS video_comments CASCADE;
DROP TABLE IF EXISTS storyboard_analyses CASCADE;

-- Drop indexes (they'll be recreated if you re-run migration)
-- Indexes are safe to drop and recreate
```

## Production Checklist

Before deploying to production:

- [ ] Migration ran successfully
- [ ] All verification queries pass
- [ ] RLS policies tested with real users
- [ ] Indexes improve query performance
- [ ] Storage bucket policies work
- [ ] Authentication is implemented
- [ ] API routes are protected
- [ ] Environment variables are secure

---

**Need Help?** Check the Supabase docs: https://supabase.com/docs/guides/database
