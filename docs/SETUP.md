# Internal Setup Guide

For Friends Innovation Lab team use only. Delete before client handoff.

## New Project Checklist

1. Create from template - In GitHub, click "Use this template". Name it client-[clientname]. Make it Private.

2. Clone and configure locally:
   - git clone git@github.com:friends-innovation-lab/[project-name].git
   - cd [project-name]
   - npm install
   - cp .env.example .env.local

3. Set up Supabase - New project at supabase.com, copy URL and anon key to .env.local

4. Set up Vercel - Import repo, add env vars, deploy

5. Configure domain - Add [project].lab.cityfriends.tech in Vercel, add CNAME in tech.domains

## Tier Notes

Discovery: Mock data OK, no auth, handoff = demo + link
Pilot-Ready: Real Supabase, basic auth, handoff = code + docs
Foundation: Full tests, types, handoff = repo transfer + walkthrough
