# Multi-Tenancy Extension

Implements: `ENTERPRISE-READINESS.md` → Multi-tenancy architecture

## What It Adds

### Database

- **`organizations`** — Tenant/organization table
  - `id uuid` — Primary key
  - `slug text` — Unique URL-safe identifier
  - `name text` — Display name
  - `created_at timestamptz`
  - `deleted_at timestamptz` — Soft-delete support

- **`org_members`** — User ↔ Organization membership
  - `org_id uuid` — FK → organizations
  - `user_id uuid` — FK → auth.users
  - `role text` — 'owner', 'admin', or 'member'
  - `created_at timestamptz`
  - Primary key: `(org_id, user_id)`

- **`user_current_org`** — Tracks each user's active organization
  - `user_id uuid` — PK, FK → auth.users
  - `org_id uuid` — FK → organizations
  - `updated_at timestamptz`

### SQL Functions

- **`current_org_id()`** — Returns the user's active org_id from `user_current_org`
  - Marked `STABLE` for query-level caching
  - Returns `NULL` for users without an active org

### RLS Policies

- Organizations: Members can SELECT their orgs
- Org members: Members can SELECT their org's members
- User current org: Users can only read/write their own row

### TypeScript Helpers

- `getCurrentOrgId()` — Server-side helper to get active org
- `getCurrentOrg()` — Fetch the full organization record
- `setCurrentOrgId(orgId)` — Switch active org (verifies membership)
- `getUserOrgs()` — List all orgs the user belongs to

### React Components

- **`OrgSwitcher.tsx`** — Header dropdown for switching organizations

## When to Use It

Use this extension for any project where multiple customers/tenants share the deployment:

- **SaaS products** with multiple business customers
- **AI products** with per-org data isolation
- **Internal tools** serving multiple teams/departments

Do NOT use for:

- Single-tenant applications
- Most federal prototypes (single-agency default)
- Personal/consumer products without org-level features

## Dependencies

None — this is a foundational extension.

Other extensions may build on it:

- `audit-log` populates `org_id` from `current_org_id()` when both are applied

## Files Added to Project

```
supabase/migrations/
  XXXXXXXX_multi_tenancy.sql   # Organizations, org_members, user_current_org

src/lib/
  org-context.ts               # Server-side org management

src/components/
  OrgSwitcher.tsx              # Header dropdown component
```

## Files Modified

- **`supabase/migrations/00000000000000_baseline.sql`** — The `handle_new_user()` trigger is updated to create a personal organization on signup

## Important: What This Extension Does NOT Change

- **`profiles` table stays user-scoped** — Profiles represent the user across all orgs, not a per-org resource
- **`profiles` RLS unchanged** — Still uses `auth.uid() = id`
- **No `org_id` on profiles** — Users exist independent of organizations

## Personal Org Auto-Creation

By default, a personal organization is created for each new user on signup.

### Default Behavior (enabled)

- Every user has at least one org immediately
- Simpler onboarding — user can start using the app right away
- User's personal data has a home org
- Use for: Consumer-facing SaaS, self-service products

### Disabling Personal Org Creation

For invite-only flows where users should NOT get a personal organization:

1. **Edit the `handle_new_user()` trigger** in `001_organizations_and_org_id.sql`
2. **Remove or wrap** the personal org creation logic (lines creating organization, org_member, user_current_org)
3. **Document the decision** in an ADR (see `docs/adr/`)

This pattern is intentionally hardcoded rather than config-flag driven because:

- Config flags via `set_config()` are session-scoped and unreliable across connections
- Invite-only flows are an architectural decision that should be explicit in code
- The change is infrequent and warrants an ADR for traceability

**When to disable:**

- Enterprise products where orgs are created by admins
- Invite-only platforms
- B2B products without self-service signup

## Migration Path

### Fresh Projects

Spinup script:

1. Copies migrations to `supabase/migrations/`
2. Copies lib files to `src/lib/`
3. Copies components to `src/components/`
4. Runs `supabase db push`

### Retrofit Projects

See `RETROFIT-PLAYBOOK.md`. High-level:

1. **Backup database**
2. **Run migration** — Creates new tables, does not modify existing user-data tables
3. **Add `org_id` to existing user-data tables** — Write a custom migration per table
4. **Backfill `org_id`** — Set to personal org for existing rows
5. **Update RLS policies** — Add `current_org_id()` checks
6. **Deploy with feature flag** — Allow gradual rollout
7. **Verify isolation** — Test cross-org access is blocked
8. **Remove feature flag**

## How to Verify It's Working

### Basic Isolation Test

```sql
-- As user in org A
SELECT set_config('request.jwt.claims', '{"sub": "user-a-id"}', true);
INSERT INTO user_current_org (user_id, org_id) VALUES ('user-a-id', 'org-a-id');

-- Create data in org A (once you have an org-scoped table)
INSERT INTO your_table (name, org_id) VALUES ('Test', current_org_id());

-- Switch to user in org B
SELECT set_config('request.jwt.claims', '{"sub": "user-b-id"}', true);
INSERT INTO user_current_org (user_id, org_id) VALUES ('user-b-id', 'org-b-id');

-- This should return 0 rows — org B cannot see org A's data
SELECT * FROM your_table WHERE org_id = current_org_id();
```

### Component Test

1. Create two organizations
2. Add test user to both
3. Load the OrgSwitcher component
4. Verify both orgs appear in dropdown
5. Switch orgs and verify data changes

## Supabase Pro Upgrade Path

For high-traffic applications, you can replace the `user_current_org` lookup with a JWT auth hook:

### 1. Create an Auth Hook

```sql
-- runs before every authenticated request
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  claims jsonb;
  user_org_id uuid;
begin
  claims := event->'claims';

  -- Get user's current org from lookup table
  select org_id into user_org_id
  from user_current_org
  where user_id = (claims->>'sub')::uuid;

  -- Add to app_metadata in the token
  claims := jsonb_set(
    claims,
    '{app_metadata, current_org_id}',
    to_jsonb(user_org_id)
  );

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;
```

### 2. Enable in Supabase Dashboard

Go to Authentication → Hooks → Access Token → Enable custom hook

### 3. Update `current_org_id()` Function

```sql
create or replace function current_org_id()
returns uuid
language sql
stable
as $$
  -- Read from JWT instead of lookup table
  select (auth.jwt() -> 'app_metadata' ->> 'current_org_id')::uuid;
$$;
```

**Benefits of JWT approach:**

- Faster — no table lookup per query
- Works with connection pooling (pgbouncer transaction mode)
- Token-based, so org context survives across requests

**Tradeoffs:**

- Requires Supabase Pro (auth hooks)
- Org switch requires token refresh (logout/login or custom refresh)
- More complex to debug
