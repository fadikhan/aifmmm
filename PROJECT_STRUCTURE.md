# AURA Studio — Project Structure

## Directory Structure

```
aura-studio/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── generate/
│   │   │       └── route.ts          # AI generation API
│   │   └── projects/
│   │       └── [id]/
│   │           └── route.ts         # Project CRUD API
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx             # Project page
│   ├── globals.css                  # Global styles + theme
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── providers.tsx                # React Query provider
├── components/
│   ├── AI/
│   │   ├── CommandPalette.tsx       # Command palette (/, Cmd+K)
│   │   └── CopilotDock.tsx          # Floating AI copilot
│   ├── Boards/
│   │   └── KanbanBoard.tsx          # Kanban board component
│   ├── Editor/
│   │   └── ScriptEditor.tsx         # TipTap script editor
│   └── UI/
│       ├── Button.tsx               # Reusable button
│       ├── GlassCard.tsx            # Glassmorphism card
│       ├── Input.tsx                # Input field
│       └── Label.tsx                 # Label component
├── db/
│   ├── migrations/
│   │   └── 001_init.sql            # Database schema
│   └── seed/
│       └── seed.json               # Sample data
├── lib/
│   ├── mocks/
│   │   └── aiResponses.json         # Mock AI responses
│   ├── aiClient.ts                  # Gemini AI client
│   ├── auth.ts                      # Auth utilities
│   ├── supabaseClient.ts            # Supabase client
│   └── utils.ts                     # Utility functions
├── scripts/
│   ├── generateMocks.js             # Generate AI mocks
│   ├── migrate.js                   # Database migration
│   └── seed.js                      # Seed database
├── tests/
│   ├── aiClient.test.ts             # AI client tests
│   ├── GlassCard.test.tsx           # Component tests
│   └── setup.ts                     # Test setup
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── Dockerfile                       # Docker configuration
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest setup
├── next.config.js                   # Next.js config
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS config
├── README.md                        # Project documentation
├── tailwind.config.ts               # Tailwind config
└── tsconfig.json                    # TypeScript config
```

## Key Files Summary

### Core Application
- **app/page.tsx**: Landing page with hero and features
- **app/dashboard/page.tsx**: Main dashboard showing projects
- **app/projects/[id]/page.tsx**: Individual project workspace
- **app/providers.tsx**: React Query setup
- **app/globals.css**: Dark theme with orange accents

### Components
- **components/UI/**: Reusable UI components (GlassCard, Button, Input)
- **components/AI/**: AI Copilot and Command Palette
- **components/Editor/**: TipTap-based script editor
- **components/Boards/**: Kanban board for task management

### Backend
- **app/api/ai/generate/route.ts**: Server-side AI generation API
- **app/api/projects/route.ts**: Project CRUD operations
- **lib/aiClient.ts**: Gemini AI integration with fallback mocks
- **lib/supabaseClient.ts**: Supabase client setup

### Database
- **db/migrations/001_init.sql**: Full database schema
- **db/seed/seed.json**: Sample data for demo
- **scripts/seed.js**: Database seeding script

### Configuration
- **package.json**: All dependencies configured
- **tailwind.config.ts**: Dark theme with glassmorphism
- **.env.example**: Environment variable template
- **Dockerfile**: Production-ready container
- **.github/workflows/ci.yml**: CI/CD pipeline

### Testing
- **tests/**: Unit tests for components and utilities
- **jest.config.js**: Jest configuration

## Features Implemented

✅ **Authentication**: Supabase Auth setup (email/OAuth)
✅ **Database Schema**: Full PostgreSQL schema with migrations
✅ **AI Integration**: Gemini AI client with mock fallbacks
✅ **UI Components**: Glass cards, buttons, inputs
✅ **Command Palette**: Global command bar (/ or Cmd+K)
✅ **AI Copilot**: Floating dock for AI assistance
✅ **Dashboard**: Project listing and stats
✅ **Project Pages**: Project workspace with scenes
✅ **API Routes**: Server-side AI and project APIs
✅ **Theme**: Dark mode with orange accents
✅ **Animations**: Framer Motion micro-animations
✅ **Tests**: Jest + React Testing Library setup
✅ **DevOps**: Docker, CI/CD, scripts

## Next Steps for Production

- [ ] Add authentication middleware to API routes
- [ ] Implement Row Level Security (RLS) policies
- [ ] Add file upload UI for Supabase Storage
- [ ] Implement actual image generation (not just mocks)
- [ ] Add email sending for team invites
- [ ] Add rate limiting to AI endpoints
- [ ] Complete admin dashboard
- [ ] Add E2E tests with Playwright

