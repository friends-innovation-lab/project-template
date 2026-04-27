# 0001 — `NEXT_PUBLIC_*` env vars as literal YAML values, not GitHub secrets

## Status

Accepted — 2026-04-27

## Context

CI workflows for this project (Accessibility Scan, Bundle Budget, Storybook Build) need Supabase env vars at build time so that Next.js can prerender authenticated pages without crashing. We initially wired these via GitHub repo secrets (`TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`).

This worked for direct PRs but fails on dependabot-triggered workflows because GitHub deliberately does not pass repo secrets to dependabot workflow runs — a security measure to prevent malicious dependency PRs from exfiltrating credentials.

The result was every dependabot PR failed two CI checks, blocking dependency hygiene.

## Decision

Replace `secrets.TEST_SUPABASE_*` references in CI workflow YAML with literal placeholder values. The placeholder URL and anon key are structurally valid (satisfying `@supabase/ssr`'s build-time validation) but obviously fake (clearly self-identified as placeholders by the hostname).

This works because:

- `NEXT_PUBLIC_*` env vars in Next.js are public by definition — they get baked into client bundles shipped to every browser
- The values only need to satisfy URL format and JWT structure validation at build time, not actually connect to Supabase
- The CI workflows that need these vars (Accessibility Scan, Bundle Budget) don't exercise authentication flows — they only render pages and inspect output

Real Supabase credentials still come from Vercel at deploy time via Vercel's env var system, which is unaffected.

## Consequences

### Positive

- Dependabot PRs now pass CI without needing access to repo secrets
- Workflow YAMLs are self-documenting — the placeholder values are obviously placeholders, not leaked credentials
- One less GitHub secret to rotate or maintain

### Negative

- Anyone modifying these workflows needs to understand why placeholder values are correct here
- If we ever add a CI workflow that needs a real Supabase connection, it will need a different mechanism (e.g., a non-secret connection string committed to the repo, or a dedicated workflow that doesn't run on dependabot)

### Neutral

- The unused `TEST_SUPABASE_URL` and `TEST_SUPABASE_ANON_KEY` repo secrets can be deleted at the maintainer's discretion

## Compliance

- [x] Reviewed against ENTERPRISE-READINESS.md
- [x] Reviewed against DATA-GOVERNANCE.md
- [x] No deviations from standards required

## References

- [GitHub docs on dependabot and secrets](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions#accessing-secrets)
- Phase 2.6 PR (test Supabase initial setup): friends-innovation-lab/project-template#10
- Phase 3.5 follow-up where this issue was discovered
