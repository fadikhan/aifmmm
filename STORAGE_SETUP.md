# Supabase Storage Setup for Video Review Feature

## Overview
The video review feature requires a Supabase Storage bucket to store video files. This guide will help you set it up.

## Storage Bucket Configuration

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ekjjgsiilbljlxebkazx`
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `aura-assets`
   - **Public bucket**: ✅ **Enable** (so videos can be accessed via public URLs)
   - **File size limit**: 100 MB (or adjust as needed)
   - **Allowed MIME types**: Leave empty or specify:
     - `video/mp4`
     - `video/quicktime`
     - `video/webm`
     - `image/jpeg`
     - `image/png`
     - `application/pdf`

6. Click **"Create bucket"**

### 2. Set Up Storage Policies (RLS)

For the bucket to work properly, you need to configure Row Level Security policies:

#### Policy 1: Allow Authenticated Users to Upload
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'aura-assets');
```

#### Policy 2: Allow Public Read Access
```sql
-- Allow anyone to read files (for video playback)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aura-assets');
```

#### Policy 3: Allow Users to Delete Their Own Files
```sql
-- Allow users to delete files from their projects
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'aura-assets');
```

#### Policy 4: Allow Users to Update Their Own Files
```sql
-- Allow users to update files
CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'aura-assets');
```

### 3. Apply Policies via Supabase Dashboard

1. Go to **Storage** → **Policies** tab
2. Select the `aura-assets` bucket
3. Click **"New Policy"**
4. Choose **"Custom"** or use the templates above
5. Add each policy one by one

### 4. Verify Environment Variables

Make sure your `.env.local` has:

```env
SUPABASE_BUCKET_ASSETS=aura-assets
```

This is already configured in your `.env.local` file ✅

## Database Schema for Assets

The app uses an `assets` table to track uploaded files. Make sure this table exists:

```sql
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  type text NOT NULL, -- 'video', 'image', 'audio', 'document', 'other'
  filename text NOT NULL,
  size bigint,
  mime_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_assets_project_id ON assets(project_id);
CREATE INDEX idx_assets_type ON assets(type);
```

## Testing the Video Upload

1. Start your dev server: `npm run dev`
2. Navigate to a project
3. Click **"Video Review"** button
4. Try uploading a video file (MP4, MOV, or WebM)
5. The video should:
   - Upload to Supabase Storage
   - Create a record in the `assets` table
   - Display in the video player

## Supported Video Formats

- **MP4** (H.264 codec recommended)
- **MOV** (QuickTime)
- **WebM**
- **Maximum file size**: 100 MB (configurable in `app/api/assets/upload/route.ts`)

## Troubleshooting

### Upload fails with "Upload failed: new row violates row-level security policy"
- Check that you've created the storage policies above
- Make sure the user is authenticated

### Video doesn't play
- Verify the bucket is set to **public**
- Check the video format is supported by browsers (H.264 MP4 works best)
- Open browser console to see any errors

### "Bucket not found" error
- Verify the bucket name is exactly `aura-assets`
- Check `SUPABASE_BUCKET_ASSETS` in `.env.local`

### File size limit exceeded
- Adjust the limit in `app/api/assets/upload/route.ts` (line 33)
- Update Supabase bucket settings

## Storage Costs

Supabase Storage pricing (as of 2024):
- **Free tier**: 1 GB storage
- **Pro tier**: 100 GB included, then $0.021/GB/month
- **Bandwidth**: $0.09/GB

For video files, monitor your usage in the Supabase dashboard.

## Next Steps

After setting up storage:
1. ✅ Create the `aura-assets` bucket
2. ✅ Configure RLS policies
3. ✅ Verify the `assets` table exists
4. 🎬 Test video upload and playback
5. 💬 Test timestamp comments feature
6. 🔒 Add authentication middleware to protect uploads

---

**Quick Setup Checklist:**
- [ ] Bucket `aura-assets` created
- [ ] Bucket set to public
- [ ] RLS policies configured
- [ ] `assets` table exists in database
- [ ] Environment variable `SUPABASE_BUCKET_ASSETS` set
- [ ] Test video upload works
