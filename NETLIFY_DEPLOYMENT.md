# 🚀 NETLIFY DEPLOYMENT GUIDE

Your AIFS project is ready for Netlify!

## ✅ Prerequisites

- GitHub account
- Netlify account (free tier works great)
- Supabase project set up
- Google AI API key

---

## 🎯 DEPLOY TO NETLIFY (5 Minutes)

### Option 1: Netlify Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

#### Step 2: Import to Netlify

1. **Go to Netlify**: https://app.netlify.com/
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to Git provider**: Choose GitHub
4. **Authorize Netlify** to access your repositories
5. **Select your repository** (e.g., "AFIMMM" or "aifs")

#### Step 3: Configure Build Settings

Netlify should auto-detect Next.js. Verify these settings:

```
Build command: npm run build
Publish directory: .next
```

**Click "Show advanced"** and add environment variables:

#### Step 4: Add Environment Variables

Click **"Add environment variable"** for each:

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ekjjgsiilbljlxebkazx.supabase.co
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g
```

**Variable 3:**
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM
```

**Variable 4:**
```
Key: GOOGLE_AI_API_KEY
Value: AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o
```

**Variable 5:**
```
Key: SUPABASE_BUCKET_ASSETS
Value: aura-assets
```

**Variable 6:**
```
Key: NODE_ENV
Value: production
```

#### Step 5: Deploy!

1. **Click "Deploy site"**
2. **Wait 3-5 minutes** for the build
3. **Your site will be live!** at `https://random-name-123.netlify.app`

---

## Option 2: Netlify CLI

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login to Netlify
```bash
netlify login
```

### Initialize and Deploy
```bash
# Initialize Netlify in your project
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: aifs (or your preferred name)
# - Build command: npm run build
# - Publish directory: .next

# Deploy to production
netlify deploy --prod
```

### Add Environment Variables via CLI
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://ekjjgsiilbljlxebkazx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM"
netlify env:set GOOGLE_AI_API_KEY "AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o"
netlify env:set SUPABASE_BUCKET_ASSETS "aura-assets"
netlify env:set NODE_ENV "production"
```

### Redeploy After Adding Variables
```bash
netlify deploy --prod
```

---

## 📋 Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ekjjgsiilbljlxebkazx.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase service role key (secret!) |
| `GOOGLE_AI_API_KEY` | `AIzaSy...` | Google AI API key |
| `SUPABASE_BUCKET_ASSETS` | `aura-assets` | Storage bucket name |
| `NODE_ENV` | `production` | Environment mode |

---

## 🔧 Configuration Files Created

### `netlify.toml`
- Build command configuration
- Next.js plugin setup
- Redirect rules for SPA routing
- Node.js version specification

### `.netlify/state.json`
- Netlify site configuration
- Auto-generated after first deploy

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `aifs.yourdomain.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

---

## 🔍 Post-Deployment Testing

After deployment, verify:

- [ ] Homepage loads at Netlify URL
- [ ] Robot background image displays
- [ ] "Get Started" button works
- [ ] "Sign In" button works
- [ ] Can navigate to `/auth/login`
- [ ] Can navigate to `/auth/register`
- [ ] Supabase connection works
- [ ] File uploads work (if storage is configured)
- [ ] AI features work (if API key is set)
- [ ] No console errors

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed with exit code 1"**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Runtime Errors

**Error: "Failed to load resource: 404"**
- Check that `netlify.toml` has correct redirects
- Verify `publish` directory is `.next`
- Make sure Next.js plugin is installed

**Error: "Supabase connection failed"**
- Verify environment variables in Netlify dashboard
- Go to Site settings → Environment variables
- Check all 6 variables are present
- Redeploy after adding variables

**Error: "AI generation failed"**
- Verify `GOOGLE_AI_API_KEY` is set
- Check API key is valid at https://makersuite.google.com/app/apikey
- Try regenerating the API key

**Error: "Storage upload failed"**
- Verify `aura-assets` bucket exists in Supabase
- Check storage policies allow public access
- Verify CORS settings in Supabase

### Performance Issues

**Slow page loads**
- Enable Netlify's asset optimization
- Go to Site settings → Build & deploy → Post processing
- Enable: Asset optimization, Pretty URLs, Bundle CSS

**Images not loading**
- Check Next.js Image configuration in `next.config.js`
- Verify remote patterns include Supabase domain
- Use WebP/AVIF formats for better performance

---

## 📊 Netlify Features to Enable

### 1. Deploy Previews
- Automatic preview deployments for pull requests
- Test changes before merging
- Each PR gets its own URL

### 2. Split Testing
- A/B test different versions
- Route percentage of traffic to different branches
- Great for testing new features

### 3. Forms (Optional)
- Built-in form handling
- No backend code needed
- Spam protection included

### 4. Functions (Optional)
- Serverless functions
- Already configured in `netlify.toml`
- Deploy API endpoints easily

### 5. Analytics (Optional)
- Server-side analytics
- No impact on site performance
- Privacy-friendly

---

## 🔒 Security Checklist

Before going live:

- [ ] All API keys are in Netlify environment variables
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` has NO real keys
- [ ] CORS is configured in Supabase
- [ ] Rate limiting implemented (if needed)
- [ ] Input validation added
- [ ] File upload validation is strict
- [ ] Database has proper RLS policies
- [ ] Storage has proper access controls

---

## 💰 Cost Estimates

### Netlify (Free Tier)
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Deploy previews
- ✅ Form submissions (100/month)

### Supabase (Free Tier)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth

### Google AI (Pay-as-you-go)
- Gemini Pro: ~$0.075 per 1M tokens
- Estimated: $5-20/month for moderate usage

---

## 🚀 Deployment Commands

```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod

# Check deployment status
netlify status

# View site
netlify open

# View logs
netlify logs

# Link existing site
netlify link
```

---

## 📈 Monitoring & Maintenance

### Set Up Notifications

1. **Deploy Notifications**
   - Go to Site settings → Build & deploy → Deploy notifications
   - Add email, Slack, or webhook notifications
   - Get notified on deploy success/failure

2. **Supabase Monitoring**
   - Monitor database usage
   - Set up storage alerts
   - Track API usage

3. **Google AI Monitoring**
   - Monitor API quota
   - Track costs
   - Set spending limits

---

## 🎯 Advantages of Netlify

✅ **Simpler deployment** - One-click deploy from GitHub  
✅ **Better Next.js support** - Official Next.js plugin  
✅ **Deploy previews** - Test PRs before merging  
✅ **Edge functions** - Faster serverless functions  
✅ **Better caching** - Automatic CDN optimization  
✅ **Free SSL** - Automatic HTTPS for custom domains  
✅ **Rollbacks** - Easy one-click rollback to previous versions  

---

## 📝 Next Steps After Deployment

1. **Test all features** on production URL
2. **Set up custom domain** (optional)
3. **Enable deploy previews** for PRs
4. **Configure Supabase** for production
5. **Run database migrations**
6. **Upload hero image** to `/public`
7. **Test on mobile devices**
8. **Enable Netlify Analytics** (optional)
9. **Set up error monitoring** (Sentry)
10. **Configure CI/CD** for automated testing

---

## 🎉 You're Ready for Netlify!

Deploy with:
```bash
netlify deploy --prod
```

Or use the dashboard at: https://app.netlify.com/

---

**Need help?** Check Netlify docs: https://docs.netlify.com/
