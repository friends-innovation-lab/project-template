# Project Name

> Brief project description.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment:** [Vercel](https://vercel.com/)

## Scripts

| Command             | Description          |
| ------------------- | -------------------- |
| `npm run dev`       | Start dev server     |
| `npm run build`     | Production build     |
| `npm run lint`      | Run ESLint           |
| `npm run lint:fix`  | Fix ESLint issues    |
| `npm run format`    | Format with Prettier |
| `npm run typecheck` | TypeScript check     |
| `npm run test`      | Run tests (watch)    |
| `npm run test:run`  | Run tests once       |

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Utilities (cn helper)
├── hooks/                # Custom hooks
└── types/                # TypeScript types
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

Browse components at [ui.shadcn.com](https://ui.shadcn.com/docs/components).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable                        | Description                             |
| ------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server only) |

## Deployment

This project deploys to Vercel automatically:

- **Production:** Merges to `main` deploy to production
- **Preview:** PRs get preview deployments

---

Built by [Friends Innovation Lab](https://cityfriends.tech)
