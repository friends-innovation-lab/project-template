# CLAUDE.md

> Instructions for Claude Code when working on this project.

## Project Overview

**[PROJECT_NAME]** — [Brief description]

- **Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- **Deployed:** Vercel at [URL]
- **Repo:** [GitHub URL]

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run typecheck    # TypeScript check
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests once
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── (auth)/       # Auth-related pages
│   └── (dashboard)/  # Dashboard pages
├── components/
│   ├── ui/           # shadcn/ui components
│   └── features/     # Feature-specific components
├── lib/
│   ├── supabase/     # Supabase clients
│   └── utils.ts      # Utility functions
├── hooks/            # Custom React hooks
└── types/            # TypeScript types
```

## Code Standards

- **Components:** Functional components with TypeScript interfaces
- **Styling:** Tailwind CSS with shadcn/ui components
- **State:** useState/useReducer for local, Context for shared
- **Data Fetching:** Server Components where possible
- **Forms:** react-hook-form + zod validation

## Database

- **Provider:** Supabase (PostgreSQL)
- **Client:** `createClient()` from `@/lib/supabase/server` (server) or `client` (browser)
- **Migrations:** `supabase/migrations/`

## Before Committing

1. Run `npm run lint:fix`
2. Run `npm run typecheck`
3. Run `npm run test:run`
4. Self-review changes

## Current Focus

<!-- Update this section with current sprint/milestone -->

- [ ] Current task 1
- [ ] Current task 2
- [ ] Current task 3

## Notes

<!-- Add project-specific notes, gotchas, or decisions -->
