# Friends Innovation Lab - Project Standards

> This file defines how Claude Code should work on this project.

---

## Project Context

This is a **Friends Innovation Lab** prototype. We build fast, high-quality prototypes for small businesses and government agencies.

- **Speed matters** — We ship in weeks, not months
- **Quality matters more** — Clients judge us on first impressions
- **Government-ready** — Even small business projects follow federal best practices

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |

---

## File Structure

```
app/
├── (auth)/           # Auth-required routes
├── (public)/         # Public routes
├── api/              # API routes (use sparingly)
├── layout.tsx
└── page.tsx          # Landing - static only!

components/
├── ui/               # shadcn/ui components
├── forms/            # Form components
├── layouts/          # Layout components
└── [feature]/        # Feature-specific components

lib/
├── supabase.ts       # Supabase browser client
├── supabase-server.ts # Supabase server client
├── utils.ts          # Utility functions
└── types.ts          # TypeScript types

hooks/                # Custom React hooks
```

---

## Critical Rules

### 1. No Server-Side Redirects on Landing Pages

```typescript
// ❌ NEVER - causes cold start delays
import { redirect } from 'next/navigation'
export default function Page() { redirect('/login') }

// ✅ Use next.config.js redirects instead (edge, instant)
```

### 2. Lazy-Load API Calls

Don't fetch data until the user needs it. No Supabase calls on initial page mount.

### 3. Type Everything

No `any` types without a comment explaining why.

### 4. Error States Are Required

Every data fetch needs loading, error, and empty states.

### 5. Mobile-First

All layouts must work on 375px width.

---

## Code Quality

Before marking any feature complete:

- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Works on mobile (375px)
- [ ] Loading states for async operations
- [ ] Error states for async operations
- [ ] Empty states where applicable

---

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check for issues
```

---

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_URL=
```

---

*See docs/LAUNCH-CHECKLIST.md before deploying to production.*
