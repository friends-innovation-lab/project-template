# Known Vulnerabilities

These vulnerabilities are documented and accepted. Each requires a major version bump or upstream fix that we've consciously deferred.

Last reviewed: 2026-04-26

---

## High Severity

### glob @ 10.2.0 - 10.4.5

- **Severity:** high
- **CVE:** GHSA-5j98-mcp5-4vw2
- **Path:** `eslint-config-next > @next/eslint-plugin-next > glob`
- **Why deferred:** Fix requires upgrading to eslint-config-next@16.x which is a breaking change requiring Next.js 16. The current stack uses Next.js 14. This upgrade is planned for Q3 2026 when Next.js 16 stabilizes.
- **Mitigation:** This vulnerability only affects glob when used via its CLI with the `-c/--cmd` flag. Our usage is indirect through ESLint plugins which do not invoke glob's CLI. The vulnerable code path is not exercised.
- **Review by:** 2026-07-31

### next @ 14.x (multiple CVEs)

- **Severity:** high
- **CVEs:**
  - GHSA-9g9p-9gw9-jx7f (DoS via Image Optimizer remotePatterns)
  - GHSA-h25m-26qc-wcjf (DoS via insecure React Server Components)
  - GHSA-ggv3-7p47-pfv8 (HTTP request smuggling in rewrites)
  - GHSA-3x4c-7xq6-9pq8 (Unbounded image disk cache growth)
  - GHSA-q4gf-8mx6-v5v3 (DoS with Server Components)
- **Path:** `next` (direct dependency)
- **Why deferred:** Fix requires upgrading to Next.js 16.x which is a breaking change. The project is currently on Next.js 14.x and an upgrade is planned for Q3 2026 when the team can allocate time for migration testing.
- **Mitigation:**
  - Image Optimizer: We use a restrictive `remotePatterns` config that only allows our own domains
  - Server Components DoS: Our RSC usage is minimal and does not expose user-controlled serialization
  - HTTP smuggling: Our deployment on Vercel includes edge-level protections
  - Disk cache: Vercel's managed infrastructure handles cache eviction
- **Review by:** 2026-07-31

---

## Moderate Severity

### esbuild @ <=0.24.2

- **Severity:** moderate
- **CVE:** GHSA-67mh-4wv8-2f99
- **Path:** `vitest > vite-node > esbuild`
- **Why deferred:** This is a dev dependency only. The vulnerability allows websites to send requests to the development server. This does not affect production builds.
- **Mitigation:** Development servers should only be run on trusted networks. This is a dev-only concern with no production impact.
- **Review by:** 2026-07-31

### postcss @ <8.5.10

- **Severity:** moderate
- **CVE:** GHSA-qx2v-qp2m-jg93
- **Path:** `next > postcss`
- **Why deferred:** Bundled with next@14.x. Will be resolved when Next.js is upgraded.
- **Mitigation:** The XSS vulnerability requires attacker-controlled CSS content to be processed. Our CSS is developer-authored, not user-supplied.
- **Review by:** 2026-07-31

### uuid @ <14.0.0

- **Severity:** moderate
- **CVE:** GHSA-w5hq-g745-h8pq
- **Path:** Multiple paths including `resend > svix > uuid`, `@storybook/test-runner > uuid`
- **Why deferred:** Transitive dependency through multiple packages. Fix requires major version bumps of resend and storybook test-runner.
- **Mitigation:** The vulnerability is a buffer bounds check issue when a custom buffer is provided to v3/v5/v6. Our code does not pass custom buffers to uuid functions.
- **Review by:** 2026-07-31

---

## Review Process

These vulnerabilities are reviewed quarterly. At each review:

1. Check if upstream fixes are available
2. Assess if breaking changes are now acceptable
3. Update mitigations if usage patterns have changed
4. Escalate any vulnerabilities that have been exploited in the wild

Next scheduled review: 2026-07-31
