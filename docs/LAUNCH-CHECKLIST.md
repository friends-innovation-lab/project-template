# Launch Checklist

Before sharing with a client, complete this checklist.

---

## Pre-Launch (Required)

### Code Quality
- [ ] `npm run build` succeeds with no errors
- [ ] No TypeScript errors
- [ ] No console errors in browser dev tools
- [ ] Tested on mobile (375px width)

### Environment
- [ ] All env vars set in Vercel dashboard
- [ ] `.env.local` NOT committed to git
- [ ] Production Supabase project (not dev)

### Performance
- [ ] No server-side redirects on landing page (use `next.config.ts`)
- [ ] Images optimized (use `next/image`)
- [ ] No unnecessary API calls on initial load

### Accessibility
- [ ] Lighthouse accessibility score > 90
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast passes WCAG AA

---

## Cold Start Prevention

Vercel serverless functions sleep after ~15 minutes. First visitor after idle = slow load.

### Option 1: UptimeRobot (Free)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://[project].lab.cityfriends.tech`
   - **Interval:** 5 minutes
4. This pings your site every 5 min, keeping it warm

### Option 2: Vercel Cron (If you have Pro)

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/health",
    "schedule": "*/5 * * * *"
  }]
}
```

Create `/app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok' })
}
```

---

## Post-Launch

- [ ] Visit production URL in incognito, verify it loads
- [ ] Test critical user flows
- [ ] Set up UptimeRobot monitor
- [ ] Share URL with client
- [ ] Note launch date in project tracking

---

## Client Demo Prep

Before any demo:

1. Visit the site yourself first (warms it up)
2. Test the exact flow you'll show
3. Have backup screenshots ready
4. Know what's "work in progress" vs "done"

---

*Questions? Check CLAUDE.md for project standards.*
