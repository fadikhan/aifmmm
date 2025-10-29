-- Storage Policies for aura-assets bucket
-- Run this in your Supabase SQL Editor

-- First, ensure the bucket exists (if not, create it via Dashboard)
-- Bucket name: aura-assets
-- Public: YES

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;

-- Policy 1: Allow anyone to upload (you can restrict to authenticated later)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'aura-assets');

-- Policy 2: Allow public read access (for video playback)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'aura-assets');

-- Policy 3: Allow anyone to delete (you can restrict later)
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'aura-assets');

-- Policy 4: Allow anyone to update (you can restrict later)
CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'aura-assets');

-- Verify policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
