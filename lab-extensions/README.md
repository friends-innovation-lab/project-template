# Lab Extensions

This directory contains source code for opt-in extension modules. Extensions are **not active code in the template itself** — they are applied per-project by the spinup script based on the `--type` flag.

## Available Extensions

### `multi-tenancy/`

Adds multi-tenant architecture support:

- `organizations` table with slug and name
- `org_members` join table with roles (owner, admin, member)
- `user_current_org` table for tracking active organization
- `current_org_id()` SQL function for RLS policies
- `OrgSwitcher.tsx` React component for the header
- TypeScript helpers for org context management

**When to use:** Any project where multiple customers/tenants share the deployment.

**Default for:** `saas-web`, `ai-product`

**Optional for:** `federal` (most federal projects are single-agency)

### `audit-log/`

Adds append-only audit logging infrastructure:

- `audit_log` table with actor, action, resource, before/after states
- Automatic trigger pattern for database-level auditing
- `audit()` TypeScript helper for application-level events
- Configurable retention (default: 7 years per DATA-GOVERNANCE.md)

**When to use:** Any project handling user data. Required for SOC 2.

**Default for:** `internal-tool`, `saas-web`, `ai-product`, `federal`

### `soft-deletes/`

Adds soft delete pattern:

- `deleted_at timestamptz` column pattern
- `soft_delete()`, `restore()`, `hard_delete()` SQL helper functions
- Partial index pattern for performance
- TypeScript query helpers that respect deletion state

**When to use:** Almost every project. Required by ENTERPRISE-READINESS.md.

**Default for:** `internal-tool`, `saas-web`, `ai-product`, `federal`

## Extensions Deferred to Later Phases

### `ai-governance/` (not yet implemented)

Will add:

- Prompt logging infrastructure
- Evaluation harness for AI outputs
- Model cards and documentation templates
- Cost tracking patterns

**Target consumer:** Qori (first AI product requiring this)

### `federal-uswds/` (not yet implemented)

Will add:

- VPAT template for Section 508 compliance
- ATO readiness checklist
- FedRAMP documentation scaffolding
- Enhanced audit requirements

**Target consumer:** First federal project requiring formal ATO

## Project Type → Extension Mapping

| Project Type    | Extensions Applied                                              |
| --------------- | --------------------------------------------------------------- |
| `prototype`     | none — base template only                                       |
| `internal-tool` | `audit-log`, `soft-deletes`                                     |
| `saas-web`      | `multi-tenancy`, `audit-log`, `soft-deletes`                    |
| `ai-product`    | `multi-tenancy`, `audit-log`, `soft-deletes`, `ai-governance`\* |
| `federal`       | `audit-log`, `soft-deletes`, `federal-uswds`\*                  |

\*When implemented

**Note:** `federal` does not get multi-tenancy by default — most federal prototypes are single-agency. Federal projects that need multi-tenancy should opt in explicitly via `--with-multi-tenancy`.

## How Extensions Get Applied

### For New Projects (Spinup)

The Phase 3 spinup script (`friends-innovation-lab/playbook/operations/automation/spinup.sh`):

1. Reads the `--type` flag
2. Copies extension files to the appropriate locations in the new project
3. Runs extension migrations after the baseline
4. **Removes `/lab-extensions/` from the new project** — clean output, no unused source

### For Existing Projects (Retrofit)

The audit script (`lab-standards/lab-templates/scripts/audit-project.sh`):

1. Scans the existing project
2. Identifies which extensions the project needs
3. Outputs a migration plan
4. Developer applies extensions manually or via a retrofit script

## How to Add a New Extension

1. Create a new subdirectory: `lab-extensions/my-extension/`

2. Follow the structure pattern:

   ```
   my-extension/
   ├── README.md              # What it adds, when to use, dependencies
   ├── migrations/            # SQL migrations (numbered)
   │   └── 001_my_extension.sql
   ├── lib/                   # TypeScript helpers
   │   └── my-helper.ts
   ├── components/            # React components (if any)
   │   └── MyComponent.tsx
   └── tests/                 # Integration tests
       └── my-extension.test.ts
   ```

3. Document in this README:
   - What the extension adds
   - When to use it
   - Which project types it's default for

4. Update the spinup script in Phase 3 to apply the extension

## Extension Dependencies

Extensions should be independent where possible. Known dependencies:

- **audit-log + multi-tenancy:** When both are applied, `audit_log.org_id` is populated from `current_org_id()`. The audit-log extension detects multi-tenancy presence.

- **soft-deletes + audit-log:** When both are applied, `hard_delete()` writes an audit log entry before actual deletion.

## Testing Extensions

Each extension includes tests in its `/tests/` directory. Tests that require a Supabase connection are marked with `.skip` and a comment explaining the setup needed.

To run extension tests locally:

1. Set up a test Supabase project
2. Apply the extension migrations
3. Set `TEST_SUPABASE_URL` and `TEST_SUPABASE_KEY` environment variables
4. Remove `.skip` from the tests
5. Run `npm test`

See ENGINEERING-OPERATIONS.md for test infrastructure standards.
