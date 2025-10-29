# AURA — AI Filmmaking Studio OS

A Notion-like AI-powered filmmaking studio built with Next.js, Supabase, and Google Gemini AI. Create, visualize, and produce your next film project with intelligent AI assistance.

![AURA Studio](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

## ✨ Features

- **AI-Powered Writing**: Generate scenes, scripts, and shotlists with Gemini AI
- **Storyboard Generator**: Visualize your scenes with AI-generated storyboards
- **Notion-like Blocks**: Modular block editor for flexible project structure
- **Team Collaboration**: Invite team members with role-based permissions
- **Asset Library**: Organize and tag production assets
- **Kanban Boards**: Manage tasks and production workflow
- **Production Tools**: Shotlists, call sheets, and scheduling
- **Post-Production**: Auto-subtitles, edit suggestions, color grading
- **Analytics Dashboard**: Track projects, costs, and deadlines

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A Supabase account and project
- A Google AI Studio API key (optional for local dev)

### Installation

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd aura-studio
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   - Get `NEXT_PUBLIC_SUPABASE_URL` and keys from your Supabase project settings
   - Get `GOOGLE_AI_API_KEY` from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run database migrations**
   ```bash
   # Open your Supabase SQL Editor and run:
   cat db/migrations/001_init.sql
   
   # Or use the migration script:
   pnpm migrate
   ```

4. **Seed demo data** (optional)
   ```bash
   pnpm seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
aura-studio/
├── app/                    # Next.js App Router pages
│   ├── api/               # Server API routes
│   │   └── ai/            # AI generation endpoints
│   ├── dashboard/         # Dashboard page
│   └── projects/          # Project pages
├── components/
│   ├── UI/                # Reusable UI components
│   ├── AI/                # AI Copilot, Command Palette
│   ├── Editor/            # Script editor components
│   └── Boards/            # Kanban, Timeline components
├── lib/
│   ├── supabaseClient.ts  # Supabase client
│   ├── aiClient.ts         # Gemini AI integration
│   └── auth.ts             # Auth utilities
├── db/
│   ├── migrations/         # SQL migrations
│   └── seed/               # Sample data
├── scripts/                # Utility scripts
└── tests/                  # Jest tests
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **State**: React Query (TanStack Query)
- **AI**: Google Generative AI (Gemini)
- **Editor**: TipTap (rich text)
- **Icons**: Lucide React

## 🔑 API Integration

### Google AI Studio (Gemini)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local`:
   ```bash
   GOOGLE_AI_API_KEY=your-key-here
   ```

**Note**: Without the API key, the app uses mock responses for local development.

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Run the migration SQL in `db/migrations/001_init.sql`
4. Create a storage bucket named `aura-assets`
5. Configure Row Level Security (RLS) policies as needed

## 🧪 Development

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint

# Test
pnpm test

# Seed database
pnpm seed

# Generate AI mocks
pnpm generate:ai-mocks
```

## 🗄️ Database Schema

Key tables:
- `users` - User accounts
- `teams` - Workspace teams
- `team_members` - Team membership with roles
- `projects` - Film projects
- `scenes` - Script scenes
- `shots` - Shot breakdowns
- `tasks` - Kanban tasks
- `assets` - Production assets
- `ai_requests` - AI usage tracking

See `db/migrations/001_init.sql` for full schema.

## 🤖 AI Features

The app integrates Google Gemini AI for:

- **Scene Generation**: `/scene` - Write scenes from prompts
- **Storyboard Creation**: `/storyboard` - Generate visual storyboards
- **Shotlist Generation**: `/shotlist` - Break scenes into shots
- **Script Rewriting**: `/rewrite` - Improve dialogue and narration
- **Summarization**: Auto-summarize long scripts
- **Continuity Analysis**: Check for wardrobe/prop consistency

**AI commands** are accessible via:
- Global command palette (press `/` or `Cmd+K`)
- Floating AI Copilot dock (bottom-right)
- Quick action buttons in the project editor

## 🎭 UI Theme

- **Dark mode** with `--bg: #0b0f14`
- **Orange accents** (`--accent: #ff6a00`)
- **Glassmorphism** panels with backdrop blur
- **Prismatic highlights** with radial gradients
- **Smooth animations** with Framer Motion
- **Keyboard-first** UX with command palette

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t aura-studio .
docker run -p 3000:3000 --env-file .env.local aura-studio
```

### Environment Variables for Production

Ensure all variables from `.env.example` are set in your deployment platform.

## 📊 Project Status

This is a scaffolded project. To make it production-ready:

- [ ] Add proper authentication middleware to API routes
- [ ] Implement RLS policies for all tables
- [ ] Add rate limiting to AI endpoints
- [ ] Implement image generation for storyboards
- [ ] Add file upload UI for Supabase Storage
- [ ] Configure email sending for invites
- [ ] Add payment/billing integration
- [ ] Complete admin dashboard
- [ ] Add E2E tests

## 🔒 Security Notes

- **Never expose `GOOGLE_AI_API_KEY` to the client**
- All AI calls must go through server API routes
- Use Supabase RLS for database access control
- Validate and sanitize all user inputs
- Implement rate limiting on AI endpoints
- Store images in Supabase Storage (not public URLs)

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Google Gemini](https://ai.google.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Happy filming! 🎬✨**

