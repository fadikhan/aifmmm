# Quick Fix for Storage Upload Error

## The Problem
You're getting: `StorageApiError: new row violates row-level security policy`

This means the storage bucket doesn't have the right permissions set up.

## Solution (2 minutes)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/ekjjgsiilbljlxebkazx
2. Click **Storage** in the left sidebar

### Step 2: Check if `aura-assets` bucket exists
- If it doesn't exist:
  - Click **"New bucket"**
  - Name: `aura-assets`
  - **Public bucket**: ✅ CHECK THIS BOX
  - Click **"Create bucket"**

- If it exists:
  - Click on the bucket name
  - Click the **Settings** icon (gear)
  - Make sure **"Public bucket"** is enabled

### Step 3: Add Storage Policies
1. Click **"Policies"** tab (in Storage section)
2. Click **"New Policy"**
3. Select **"For full customization"**
4. Add this policy:

**Policy Name:** `Allow all operations`

**Target roles:** `public`

**Policy definition:**
```sql
true
```

**Allowed operations:** Check ALL boxes (SELECT, INSERT, UPDATE, DELETE)

Click **"Save policy"**

### Alternative: Run SQL (Easier)
1. Go to **SQL Editor** in Supabase
2. Click **"New query"**
3. Paste this:

```sql
-- Enable all operations on aura-assets bucket
CREATE POLICY "Allow all operations on aura-assets"
ON storage.objects
FOR ALL
USING (bucket_id = 'aura-assets')
WITH CHECK (bucket_id = 'aura-assets');
```

4. Click **"Run"**

### Step 4: Test Upload Again
1. Go back to your app: http://localhost:3000
2. Navigate to Video Review
3. Try uploading a video again

## Still Not Working?

### Check bucket is public:
```sql
-- Run in SQL Editor
SELECT * FROM storage.buckets WHERE name = 'aura-assets';
```

Make sure `public` column is `true`.

### If bucket is not public, make it public:
```sql
UPDATE storage.buckets 
SET public = true 
WHERE name = 'aura-assets';
```

### Verify policies exist:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

You should see at least one policy for the `aura-assets` bucket.

## Need Help?
If still having issues, check:
1. Bucket name is exactly `aura-assets` (no typos)
2. Bucket is set to public
3. At least one policy exists that allows INSERT
4. Your Supabase project is active (not paused)

---

**TL;DR:**
1. Go to Supabase Dashboard → Storage
2. Make sure `aura-assets` bucket exists and is **public**
3. Add a policy that allows all operations
4. Try upload again ✅
