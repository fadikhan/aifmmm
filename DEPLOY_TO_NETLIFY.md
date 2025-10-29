# 🚀 DEPLOY TO NETLIFY - QUICK START

## ⚡ 5-Minute Deployment

### Step 1: Push to GitHub (if not done)
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Deploy to Netlify

#### Option A: Netlify Dashboard (Easiest)

1. **Go to Netlify**: https://app.netlify.com/
2. **Click "Add new site"** → "Import an existing project"
3. **Choose GitHub** and authorize Netlify
4. **Select your repository**
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **"Show advanced"**
6. **Add environment variables** (click "New variable" for each):
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://ekjjgsiilbljlxebkazx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
   GOOGLE_AI_API_KEY = AIzaSy...
   SUPABASE_BUCKET_ASSETS = aura-assets
   NODE_ENV = production
   ```
   (Full values in `NETLIFY_ENV_VARIABLES.txt`)
7. **Click "Deploy site"**
8. **Wait 3-5 minutes**
9. **Done!** Your site is live at `https://random-name.netlify.app`

#### Option B: Netlify CLI (For Developers)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init

# Add environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://ekjjgsiilbljlxebkazx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGci..."
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGci..."
netlify env:set GOOGLE_AI_API_KEY "AIzaSy..."
netlify env:set SUPABASE_BUCKET_ASSETS "aura-assets"
netlify env:set NODE_ENV "production"

# Deploy to production
netlify deploy --prod
```

---

## 📋 Environment Variables Checklist

Add these 6 variables (copy from `NETLIFY_ENV_VARIABLES.txt`):

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GOOGLE_AI_API_KEY`
- [ ] `SUPABASE_BUCKET_ASSETS`
- [ ] `NODE_ENV`

---

## ✅ After Deployment - Test These

Visit your Netlify URL and verify:

- [ ] Homepage loads (no 404)
- [ ] Robot background image shows
- [ ] "Get Started" button works
- [ ] "Sign In" button works
- [ ] Can navigate to `/auth/login`
- [ ] Can navigate to `/auth/register`
- [ ] No console errors

---

## 🎨 Customize Your Site

### Change Site Name
1. Go to **Site settings** → **General**
2. Click **"Change site name"**
3. Enter your preferred name (e.g., `aifs-studio`)
4. Your URL becomes: `https://aifs-studio.netlify.app`

### Add Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS configuration instructions
5. Free SSL certificate included!

---

## 🔧 Configuration Files

I've created these files for Netlify:

- ✅ `netlify.toml` - Build configuration
- ✅ `.netlify/state.json` - Site state
- ✅ `NETLIFY_ENV_VARIABLES.txt` - Your env vars
- ✅ `NETLIFY_DEPLOYMENT.md` - Full deployment guide

---

## 🐛 Troubleshooting

### Build Fails?
1. Check build logs in Netlify dashboard
2. Verify all environment variables are added
3. Test build locally: `npm run build`

### Site Shows 404?
1. Check that publish directory is `.next`
2. Verify `netlify.toml` exists
3. Check redirects in `netlify.toml`

### Environment Variables Not Working?
1. Go to Site settings → Environment variables
2. Verify all 6 variables are present
3. Trigger a new deploy: Deploys → Trigger deploy

---

## 🎯 Why Netlify?

✅ **Easier than Vercel** - Simpler configuration  
✅ **Better Next.js support** - Official plugin  
✅ **Deploy previews** - Test PRs automatically  
✅ **One-click rollbacks** - Revert to any previous version  
✅ **Free SSL** - Automatic HTTPS  
✅ **Global CDN** - Fast worldwide  
✅ **100GB bandwidth** - Free tier  

---

## 📚 More Help

- **Full guide**: `NETLIFY_DEPLOYMENT.md`
- **Environment variables**: `NETLIFY_ENV_VARIABLES.txt`
- **Netlify docs**: https://docs.netlify.com/

---

## 🎉 You're Ready!

Deploy now at: https://app.netlify.com/

Your AIFS app will be live in 5 minutes! 🚀
