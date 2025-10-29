# 🔧 NETLIFY 500 ERROR - FIX NOW

## The Problem
Your site deployed successfully, but you're getting a 500 Internal Server Error because **environment variables are missing**.

---

## ✅ SOLUTION - Add Environment Variables

### Step 1: Go to Netlify Dashboard
1. Open https://app.netlify.com/
2. Click on your site
3. Click **"Site settings"**
4. Click **"Environment variables"** in the left sidebar

### Step 2: Add ALL 6 Variables

Click **"Add a variable"** → **"Add a single variable"** for each:

#### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ekjjgsiilbljlxebkazx.supabase.co
```

#### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g
```

#### Variable 3:
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM
```

#### Variable 4:
```
Key: GOOGLE_AI_API_KEY
Value: AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o
```

#### Variable 5:
```
Key: SUPABASE_BUCKET_ASSETS
Value: aura-assets
```

#### Variable 6:
```
Key: NODE_ENV
Value: production
```

### Step 3: Redeploy
**CRITICAL**: After adding all variables, you MUST redeploy!

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. Wait 3-5 minutes

---

## 🎯 Quick Checklist

Before redeploying:
- [ ] All 6 environment variables added
- [ ] Each variable saved (click "Create variable")
- [ ] No typos in variable names (case-sensitive!)
- [ ] No extra spaces in values
- [ ] Triggered "Clear cache and deploy site"

---

## 🔍 Verify Variables Are Added

In Netlify Dashboard → Site settings → Environment variables

You should see:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ GOOGLE_AI_API_KEY
- ✅ SUPABASE_BUCKET_ASSETS
- ✅ NODE_ENV

If ANY are missing, add them and redeploy!

---

## 📊 After Redeployment

Visit your site URL: `https://your-site.netlify.app`

You should see:
- ✅ AIFS homepage with robot background
- ✅ No 500 error
- ✅ "Get Started" and "Sign In" buttons work
- ✅ No console errors

---

## 🐛 Still Getting 500 Error?

### Check Function Logs

1. Go to **"Functions"** tab in Netlify
2. Click on any function
3. Check the logs for error messages

### Check Deploy Logs

1. Go to **"Deploys"** tab
2. Click on the latest deployment
3. Scroll to **"Function bundling"** section
4. Look for any errors

### Common Issues:

**Error: "Missing environment variable"**
- Solution: Add the missing variable and redeploy

**Error: "Cannot connect to Supabase"**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Verify Supabase project is active

**Error: "Module not found"**
- Clear cache and redeploy
- Check all dependencies are in package.json

---

## 🆘 Alternative: Use CLI to Add Variables

If the dashboard isn't working, use CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Add variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://ekjjgsiilbljlxebkazx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM"
netlify env:set GOOGLE_AI_API_KEY "AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o"
netlify env:set SUPABASE_BUCKET_ASSETS "aura-assets"
netlify env:set NODE_ENV "production"

# Redeploy
netlify deploy --prod
```

---

## 📝 Why This Happens

Next.js needs environment variables at **build time** AND **runtime**:

- `NEXT_PUBLIC_*` variables are embedded in the build
- Other variables are used by server-side functions
- Without them, the app crashes with 500 error

**Solution**: Add all variables BEFORE building!

---

## ✅ Summary

1. **Add all 6 environment variables** in Netlify Dashboard
2. **Trigger "Clear cache and deploy site"**
3. **Wait 3-5 minutes**
4. **Visit your site** - Should work now!

---

## 🎉 After It Works

Your AIFS app will be live at: `https://your-site.netlify.app`

You can then:
- Customize the site name
- Add a custom domain
- Enable deploy previews
- Set up continuous deployment

---

**The fix is simple: Add environment variables and redeploy!** 🚀
