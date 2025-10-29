# 🚀 AURA Studio — Quick Start Guide

## Welcome to AURA!

This guide will help you get the AURA AI Filmmaking Studio running in 5 minutes.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google AI Studio API key (optional for local dev)

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

Or with npm/yarn:
```bash
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your credentials
```

**Required values**:
- `NEXT_PUBLIC_SUPABASE_URL`: From your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From your Supabase project settings  
- `GOOGLE_AI_API_KEY`: From [Google AI Studio](https://makersuite.google.com/app/apikey) (optional)

### 3. Set Up Database

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and run the contents of `db/migrations/001_init.sql`

**Option B: Using Supabase CLI** (if installed)
```bash
supabase db push
```

Create a storage bucket:
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('aura-assets', 'aura-assets', true);
```

### 4. Seed Sample Data (Optional)

```bash
pnpm seed
```

This creates a demo project you can explore.

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎬 What You Can Do Now

### Landing Page
- Visit `/` to see the hero page
- Explore the features showcase

### Dashboard
- Visit `/dashboard` to see your projects
- Stats cards show your project counts
- Create new projects

### Project Workspace
- Click any project to open it
- Use quick action buttons to:
  - Generate scenes with AI
  - Create shotlists
  - Generate storyboards
  - Upload assets

### AI Features
- Press `/` or `Cmd/Ctrl+K` to open command palette
- Click the AI Copilot icon (bottom-right) for chat
- Use templates like `/scene`, `/shotlist`, `/storyboard`

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm test            # Run tests

# Database
pnpm migrate          # Show migration SQL
pnpm seed             # Seed sample data
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has correct values
- Check that variable names match `.env.example`

### "AI generation returns mock responses"
- Add `GOOGLE_AI_API_KEY` to `.env.local`
- Get a key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### "Database tables not found"
- Run the SQL migration in `db/migrations/001_init.sql`
- Check your Supabase connection settings

### "Import errors in components"
- Make sure all dependencies are installed: `pnpm install`
- Try deleting `node_modules` and reinstalling

## 📦 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```bash
docker build -t aura-studio .
docker run -p 3000:3000 --env-file .env.local aura-studio
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  accent: '#your-color',      // Primary accent
  'accent-2': '#your-color-2', // Secondary accent
}
```

### Add New AI Commands

Edit `components/AI/CopilotDock.tsx`:
```typescript
const AI_COMMAND_TEMPLATES = [
  // Add your templates here
]
```

### Modify Database Schema

1. Update `db/migrations/001_init.sql`
2. Run migration in Supabase SQL Editor
3. Update TypeScript types

## 📚 Next Steps

- [Read the full README](./README.md)
- [Check database schema](./db/migrations/001_init.sql)
- [Review API routes](./app/api/)
- [Explore components](./components/)
- [See project structure](./PROJECT_STRUCTURE.md)

## 🆘 Need Help?

1. Check [troubleshooting](#-troubleshooting)
2. Review [README.md](./README.md) for detailed docs
3. Open an issue on GitHub
4. Check Supabase/Next.js documentation

## 🎉 You're Ready!

Start creating AI-powered films with AURA! 🎬✨

