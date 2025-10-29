# 🔧 Fix for "fetch failed" Error

## The Problem

Getting `TypeError: fetch failed` means the API route can't connect to Supabase.

## ✅ Quick Fixes

### Fix 1: Restart the Dev Server (Most Likely)

Environment variables need to be reloaded:

```bash
# Stop the server (Ctrl+C)
pnpm dev
```

Then try creating a project again.

### Fix 2: Check Terminal Output

Look in your terminal for errors like:
- `Missing Supabase environment variables`
- `Failed to create project`
- `Supabase error: ...`

This will tell you exactly what's wrong.

### Fix 3: Verify Environment Variables

Make sure `.env.local` exists and has your Supabase credentials:

```bash
# Check if file exists
ls .env.local

# View contents (remove -ErrorAction if on Mac/Linux)
cat .env.local
```

### Fix 4: Network/CORS Issue

If Supabase URL is blocked, try running with a different approach:

Create a test API route to check connection:

```bash
# Create test file
echo "export async function GET() { return Response.json({ success: true }) }" > app/api/test/route.ts
```

Visit http://localhost:3000/api/test - should return `{"success":true}`

---

## 🎯 What's Most Likely Happening

The server started before `.env.local` existed or was updated. 

### Solution:

1. **Stop the server** completely
2. **Make sure `.env.local` exists** with your credentials
3. **Restart**: `pnpm dev`
4. **Try again**

---

## 🔍 Debug Steps

### Check 1: Is Supabase URL Reachable?

```bash
# Run this in terminal
curl https://ekjjgsiilbljlxebkazx.supabase.co/rest/v1/
```

If this fails, there's a network/firewall issue.

### Check 2: Are Environment Variables Loaded?

Check your terminal output when starting the server. Look for:
- Any errors about missing environment variables
- Supabase connection messages

### Check 3: Browser Console

Press F12 in browser → Console tab. Look for:
- Network errors
- CORS errors
- Failed fetch requests

---

## ✅ Expected Behavior After Fix

1. **Start server**: `pnpm dev` (shows "Ready on http://localhost:3000")
2. **Create project**: Form submits successfully
3. **See success**: Redirects to project page
4. **Project appears**: In dashboard

If you still see errors, check the terminal for detailed logs.

