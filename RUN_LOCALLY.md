# 🏃 RUN YOUR APP LOCALLY

## Quick Start

Open terminal in your project folder and run:

```bash
npm run dev
```

Then open: http://localhost:3000

Your app will be running locally!

---

## ✅ What You Can Do Locally

- ✅ View the homepage
- ✅ Test all pages
- ✅ Create projects
- ✅ Upload files (if Supabase is configured)
- ✅ Test AI features (if API key is set)

---

## 🔧 If "Failed to fetch" Error

This error means the app can't connect to Supabase. Check:

1. **Is `.env.local` file present?**
   - Should be in project root
   - Contains your Supabase credentials

2. **Are environment variables correct?**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ekjjgsiilbljlxebkazx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

3. **Is Supabase project active?**
   - Go to https://supabase.com/dashboard
   - Check your project is running

---

## 🐛 Troubleshooting

### Error: "Port 3000 is already in use"
```bash
# Kill the process using port 3000
npx kill-port 3000

# Then run again
npm run dev
```

### Error: "Module not found"
```bash
# Reinstall dependencies
npm install

# Then run
npm run dev
```

### Error: "Failed to fetch" on login
This means Supabase connection isn't working. Check:
- `.env.local` file exists
- Environment variables are correct
- Supabase project is active

---

## 📝 For Development

While running locally, you can:
- Make changes to code
- See changes instantly (hot reload)
- Test features before deploying
- Debug issues

---

## 🚀 When Ready to Deploy

Once everything works locally:
1. Push to GitHub
2. Deploy to Vercel or Netlify
3. Add environment variables
4. Your app will be live!

---

**Run `npm run dev` now to start your app locally!**
