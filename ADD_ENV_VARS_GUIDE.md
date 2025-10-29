# 📋 HOW TO ADD ENVIRONMENT VARIABLES IN VERCEL

## Step-by-Step Visual Guide

### 1. Go to Your Project Settings

1. Open https://vercel.com/dashboard
2. Click on your project (e.g., "aifs" or "AFIMMM")
3. Click the **"Settings"** tab at the top

### 2. Navigate to Environment Variables

1. In the left sidebar, click **"Environment Variables"**
2. You'll see a form to add new variables

### 3. Add Each Variable

For **EACH** of the 6 variables below, do this:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ekjjgsiilbljlxebkazx.supabase.co
```
- Check: ☑ Production
- Check: ☑ Preview  
- Check: ☑ Development
- Click **"Save"**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g
```
- Check: ☑ Production, Preview, Development
- Click **"Save"**

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM
```
- Check: ☑ Production, Preview, Development
- Click **"Save"**

#### Variable 4: GOOGLE_AI_API_KEY
```
Name: GOOGLE_AI_API_KEY
Value: AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o
```
- Check: ☑ Production, Preview, Development
- Click **"Save"**

#### Variable 5: SUPABASE_BUCKET_ASSETS
```
Name: SUPABASE_BUCKET_ASSETS
Value: aura-assets
```
- Check: ☑ Production, Preview, Development
- Click **"Save"**

#### Variable 6: NODE_ENV
```
Name: NODE_ENV
Value: production
```
- Check: ☑ Production ONLY
- Click **"Save"**

### 4. Verify All Variables Are Added

After adding all 6, you should see them listed:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ GOOGLE_AI_API_KEY
- ✅ SUPABASE_BUCKET_ASSETS
- ✅ NODE_ENV

### 5. Redeploy Your App

**IMPORTANT**: After adding variables, you MUST redeploy!

1. Click **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeploy
6. Wait 2-3 minutes

### 6. Test Your App

Visit your Vercel URL (e.g., `https://your-app.vercel.app`)

You should see:
- ✅ AIFS homepage with robot background
- ✅ "Get Started" and "Sign In" buttons
- ✅ No 404 errors

---

## 🎯 Quick Copy-Paste Format

If you prefer to copy-paste, here's the format:

```
NEXT_PUBLIC_SUPABASE_URL=https://ekjjgsiilbljlxebkazx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM
GOOGLE_AI_API_KEY=AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o
SUPABASE_BUCKET_ASSETS=aura-assets
NODE_ENV=production
```

---

## ⚠️ Common Mistakes to Avoid

1. **Forgetting to redeploy** - Variables only take effect after redeployment
2. **Typos in variable names** - Must match exactly (case-sensitive)
3. **Missing environments** - Select Production, Preview, AND Development
4. **Extra spaces** - Don't add spaces before/after values
5. **Wrong values** - Copy-paste exactly from this guide

---

## 🆘 Troubleshooting

**Variables not showing up?**
- Refresh the page
- Make sure you clicked "Save" for each one

**App still not working after adding variables?**
- Did you redeploy? (Step 5)
- Check build logs in Deployments tab
- Verify all 6 variables are present

**Build fails after adding variables?**
- Check the build logs for specific errors
- Verify Supabase URL is correct
- Make sure API keys are valid

---

## ✅ Checklist

Before you finish:
- [ ] All 6 environment variables added
- [ ] Each variable saved successfully
- [ ] Redeployed the app
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested the app URL
- [ ] Homepage loads correctly
- [ ] No 404 errors

---

**You're all set!** 🎉

Your AIFS app should now be live and working on Vercel.
