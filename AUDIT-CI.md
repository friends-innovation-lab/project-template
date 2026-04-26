# CI Workflow Audit

**Date:** 2026-04-26
**Branch:** fix/ci-configuration-cleanup
**Auditor:** Claude Code

---

## Summary

All six CI workflows are currently failing. The **root cause** is a lockfile mismatch (`@swc/helpers` version conflict) that causes `npm ci` to fail in every workflow that installs dependencies. Beyond that, each workflow has additional configuration issues.

---

## 1. CI (`ci.yml`)

**What it does:** Runs lint, typecheck, and unit tests on every push to main/develop and every PR.

**Actual error:**

```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
npm error Invalid: lock file's @swc/helpers@0.5.5 does not satisfy @swc/helpers@0.5.21
npm error Missing: @swc/helpers@0.5.5 from lock file
```

**Proposed fix:**

1. Run `npm install` to regenerate a consistent lockfile
2. Commit the updated `package-lock.json`

---

## 2. Bundle Budget (`bundle-budget.yml`)

**What it does:** Uses `size-limit` to check that JS bundle sizes stay within configured budgets. Fails if any bundle exceeds its limit.

**Actual error:**

- Primary: Same `npm ci` lockfile mismatch as above
- Secondary: Missing `.size-limit.json` configuration file (the action references it but it doesn't exist)

**Proposed fix:**

1. Fix the lockfile (same as CI)
2. Install `size-limit` and `@size-limit/file` as devDependencies
3. Create `.size-limit.json` with budgets based on current build output (~1.5x current sizes)

---

## 3. Security Scan — Secret Scanning (`security-scan.yml`, `gitleaks` job)

**What it does:** Scans git history for accidentally committed secrets using gitleaks.

**Actual error:**

```
##[error] missing gitleaks license. Go grab one at gitleaks.io and store it as a GitHub Secret named GITLEAKS_LICENSE.
```

**Proposed fix:**
The `gitleaks-action@v2` requires a paid license for use in GitHub Actions. Options:

1. Purchase a gitleaks license and add as `GITLEAKS_LICENSE` secret
2. Switch to running gitleaks directly via `brew install gitleaks && gitleaks detect` which doesn't require a license
3. Use truffleHog or another free alternative
4. Rely on GitHub's built-in secret scanning (available for public repos and GitHub Advanced Security subscribers)

**Recommended:** Switch the job to run `gitleaks detect` directly instead of using the paid action. The `.gitleaks.toml` config already exists and is well-configured.

---

## 4. Security Scan — Dependency Audit (`security-scan.yml`, `dependency-audit` job)

**What it does:** Runs `npm audit --audit-level=high` to fail if any dependency has high or critical vulnerabilities.

**Actual error:**

- Primary: Same `npm ci` lockfile mismatch
- Secondary: Once lockfile is fixed, there are 18 vulnerabilities (14 moderate, 4 high) that will cause this job to fail

**Proposed fix:**

1. Fix the lockfile
2. Run `npm audit fix` to address what can be auto-fixed
3. Document remaining vulnerabilities in `docs/runbooks/known-vulnerabilities.md`
4. Change audit threshold to `--audit-level=critical` with documented acceptance of tracked high-severity issues

---

## 5. Security Scan — License Compliance (`security-scan.yml`, `license-check` job)

**What it does:** Uses `license-checker` to ensure no dependencies use copyleft licenses (GPL, AGPL, LGPL).

**Actual error:**

- Primary: Same `npm ci` lockfile mismatch
- Secondary: Once fixed, the job should pass — need to verify after lockfile is fixed

**Proposed fix:**

1. Fix the lockfile
2. Verify `license-checker --failOn "GPL;AGPL;LGPL" --summary` passes
3. (Optional) Create `.licensecheckerrc.json` for cleaner configuration

---

## 6. Preview Deployment Check (`preview.yml`)

**What it does:** Posts a "Preview deployment" comment with a QA checklist on every PR.

**Actual error:**

```
RequestError [HttpError]: Resource not accessible by integration
status: 403
```

The `GITHUB_TOKEN` provided by Dependabot PRs doesn't have `write` permission on issues/pull-requests, so the action cannot post comments.

**Proposed fix:**
Per Lapedra's decision: **Delete this workflow entirely.** Vercel's native GitHub integration already posts preview URLs on PRs, making this workflow redundant. Removing it avoids both the permission issue and the duplication of functionality.

---

## Fix Order

1. **Delete preview.yml** (per Lapedra's decision)
2. **Fix lockfile** — run `npm install` to regenerate consistent lock
3. **Install size-limit and create .size-limit.json** for bundle budget
4. **Fix gitleaks job** — switch from paid action to direct gitleaks command
5. **Address npm audit** — audit fix + document remaining + adjust threshold
6. **Verify license-checker passes**
7. **Verify all workflows pass** with a smoke test

---

## Files to Create/Modify

| File                                     | Action                                      |
| ---------------------------------------- | ------------------------------------------- |
| `.github/workflows/preview.yml`          | Delete                                      |
| `package-lock.json`                      | Regenerate via `npm install`                |
| `package.json`                           | Add size-limit devDependencies              |
| `.size-limit.json`                       | Create (new)                                |
| `.github/workflows/security-scan.yml`    | Modify gitleaks job, modify audit threshold |
| `docs/runbooks/known-vulnerabilities.md` | Create (new)                                |
