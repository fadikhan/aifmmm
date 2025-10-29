# 🚀 AIFS - Vercel Deployment Guide

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase project set up
- ✅ Google AI API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

**IMPORTANT: Remove sensitive data first!**

```bash
# 1. Delete the old .env.local with real keys
rm .env.local

# 2. Make sure .gitignore is working
git status
# Should NOT show .env.local

# 3. Commit your changes
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://ekjjgsiilbljlxebkazx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
   GOOGLE_AI_API_KEY = your_google_ai_key_here
   SUPABASE_BUCKET_ASSETS = aura-assets
   NODE_ENV = production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? aifs
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_AI_API_KEY

# Deploy to production
vercel --prod
```

### 3. Configure Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 4. Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Hero image displays correctly
- [ ] Can navigate to all pages
- [ ] Supabase connection works
- [ ] File uploads work
- [ ] AI features work (if API key is set)
- [ ] No console errors
- [ ] Mobile responsive

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secret!) | Supabase Dashboard → Settings → API |
| `GOOGLE_AI_API_KEY` | Google AI Studio API key | https://makersuite.google.com/app/apikey |
| `SUPABASE_BUCKET_ASSETS` | Storage bucket name | Set to: `aura-assets` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_WEBHOOK_URL` | Discord notifications |
| `YOUTUBE_API_KEY` | YouTube integration |
| `NEXTAUTH_SECRET` | NextAuth secret (if using) |

## Vercel Configuration Files

### ✅ Created Files

1. **vercel.json** - Deployment configuration
2. **.gitignore** - Prevents committing sensitive files
3. **.env.example** - Template with placeholders (no real keys)
4. **next.config.js** - Optimized for production

### Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Type errors"**
```bash
# Check TypeScript
npm run type-check
```

### Runtime Errors

**Error: "Supabase connection failed"**
- Check environment variables are set in Vercel
- Verify Supabase URL is correct
- Check anon key is valid

**Error: "AI generation failed"**
- Verify `GOOGLE_AI_API_KEY` is set
- Check API key is valid
- Try model name: `gemini-2.5-flash`

**Error: "Storage upload failed"**
- Verify `aura-assets` bucket exists
- Check storage policies are set
- Verify bucket is public

### Performance Issues

**Slow page loads**
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

**Images not loading**
- Check Next.js Image configuration
- Verify remote patterns in next.config.js
- Use WebP/AVIF formats

## Vercel Features to Enable

### 1. Analytics
- Go to Vercel Dashboard → Analytics
- Enable Web Analytics (free)
- Track page views and performance

### 2. Speed Insights
- Enable Speed Insights
- Monitor Core Web Vitals
- Get performance recommendations

### 3. Edge Functions (Optional)
- Convert API routes to Edge Functions for faster response
- Add `export const runtime = 'edge'` to API routes

### 4. Cron Jobs (Optional)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 0 * * *"
  }]
}
```

## Security Checklist

Before going live:

- [ ] All API keys are in Vercel environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` has NO real keys
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented
- [ ] Input validation is added
- [ ] File upload validation is strict
- [ ] Database has proper access controls

## Monitoring & Maintenance

### Set Up Alerts

1. **Vercel Notifications**
   - Enable deployment notifications
   - Set up Slack/Discord webhooks

2. **Supabase Monitoring**
   - Monitor database usage
   - Set up storage alerts
   - Track API usage

3. **Google AI Monitoring**
   - Monitor API quota
   - Track costs
   - Set spending limits

## Cost Estimates

### Vercel (Free Tier)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Edge Network

### Supabase (Free Tier)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth

### Google AI (Pay-as-you-go)
- Gemini 2.5 Flash: ~$0.075 per 1M tokens
- Estimated: $5-20/month for moderate usage

## Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

## Post-Deployment

After successful deployment:

1. ✅ Test all features on production URL
2. ✅ Run database migrations on Supabase
3. ✅ Upload hero image to `/public`
4. ✅ Test video upload and review
5. ✅ Test storyboard analysis
6. ✅ Verify AI features work
7. ✅ Test on mobile devices
8. ✅ Check performance with Lighthouse

## Next Steps

1. **Set up custom domain** (optional)
2. **Enable Vercel Analytics**
3. **Add error monitoring** (Sentry)
4. **Implement authentication**
5. **Add rate limiting**
6. **Set up CI/CD** for automated testing

---

**Your app is now ready for Vercel! 🚀**

Deploy with: `vercel --prod`
