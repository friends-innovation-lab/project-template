# Audit Log Extension

Implements: `ENTERPRISE-READINESS.md` → "Audit and observability"

## What It Adds

### Database

- **`audit_log`** — Append-only audit log table
  - `id uuid` — Primary key
  - `created_at timestamptz` — When the event occurred
  - `actor_id uuid` — User who performed the action (nullable for system actions)
  - `action text` — What happened (e.g., 'user.login', 'item.created')
  - `resource_type text` — Type of resource affected (e.g., 'user', 'item')
  - `resource_id text` — ID of the affected resource
  - `before jsonb` — State before the change (for updates/deletes)
  - `after jsonb` — State after the change (for creates/updates)
  - `ip inet` — Client IP address
  - `user_agent text` — Client user agent
  - `org_id uuid` — Organization context (populated from `current_org_id()` if multi-tenancy is applied)
  - `metadata jsonb` — Additional event-specific data

### Constraints

- **Append-only** — UPDATE and DELETE are revoked from all roles
- Only INSERT is allowed
- This ensures audit integrity — events cannot be modified after creation

### SQL Functions

- **`log_changes()`** — Generic trigger function for automatic row-level auditing
- **`enable_audit(table_name)`** — Helper to attach audit trigger to a table

### TypeScript Helpers

- **`audit()`** — Application-level audit logging for events the trigger can't see

## When to Use It

Use this extension for:

- **Any project handling user data** — SOC 2 requires audit trails
- **Compliance-sensitive applications** — HIPAA, PCI, etc.
- **Applications with admin actions** — Track who did what

Required by default for: `internal-tool`, `saas-web`, `ai-product`, `federal`

## Dependencies

None — this is standalone infrastructure.

### Integration with Multi-Tenancy

When both extensions are applied:

- `audit_log.org_id` is automatically populated from `current_org_id()`
- The `audit()` helper falls back gracefully if `current_org_id()` returns null

## Files Added to Project

```
supabase/migrations/
  XXXXXXXX_audit_log.sql       # Audit log table and triggers

src/lib/
  audit.ts                     # TypeScript helper for application events
```

## What Gets Logged

Per ENTERPRISE-READINESS.md:

### Automatically Logged (via trigger)

- Row insertions on opted-in tables
- Row updates on opted-in tables (with before/after diff)
- Row deletions on opted-in tables

### Manually Logged (via `audit()` helper)

- User authentication events (login, logout, failed attempts)
- Permission changes (role grants, revocations)
- Data exports
- Admin actions
- Security-sensitive operations

### What Does NOT Get Logged

- **Read operations** — Too noisy, would bloat the log
- **Anonymous/public reads** — No actor to attribute
- **Health checks** — Operational noise
- **Static asset requests** — Not meaningful

**Rationale:** Audit logs should capture actions that modify state or represent security-relevant events. Reads are handled by access logs at the infrastructure level.

## Retention

Per DATA-GOVERNANCE.md:

- Default retention: **7 years**
- High-security contexts may require longer

The migration includes a comment documenting the retention policy. Actual deletion should be handled by a scheduled job (not implemented in the migration).

## Migration Path

### Fresh Projects

Spinup script:

1. Copies migration to `supabase/migrations/`
2. Copies lib files to `src/lib/`
3. Runs `supabase db push`

### Retrofit Projects

1. Apply the migration
2. Identify tables that need auditing
3. Run `SELECT enable_audit('table_name')` for each table
4. Add `audit()` calls to application code for non-DB events

## Usage Examples

### Automatic Table Auditing

```sql
-- Enable auditing for the 'items' table
SELECT enable_audit('items');

-- Now all INSERT, UPDATE, DELETE on items will be logged
INSERT INTO items (name) VALUES ('Test');
-- → audit_log entry created with action = 'items.insert'

UPDATE items SET name = 'Updated' WHERE id = '...';
-- → audit_log entry with before = {name: 'Test'}, after = {name: 'Updated'}
```

### Application-Level Auditing

```typescript
import { audit } from "@/lib/audit";

// Log a login attempt
await audit({
  action: "user.login",
  resourceType: "user",
  resourceId: userId,
  metadata: { method: "magic-link", success: true },
});

// Log an export event
await audit({
  action: "data.export",
  resourceType: "report",
  resourceId: reportId,
  metadata: { format: "csv", rowCount: 1500 },
});
```

## Querying the Audit Log

```sql
-- Recent activity for a specific user
SELECT * FROM audit_log
WHERE actor_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 50;

-- All changes to a specific resource
SELECT * FROM audit_log
WHERE resource_type = 'item'
  AND resource_id = 'item-uuid'
ORDER BY created_at;

-- Security-relevant events in the last 24 hours
SELECT * FROM audit_log
WHERE action LIKE 'user.%'
  AND created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

-- Activity within an organization (if multi-tenancy applied)
SELECT * FROM audit_log
WHERE org_id = current_org_id()
ORDER BY created_at DESC
LIMIT 100;
```

## Security Considerations

1. **Append-only enforcement** — The migration revokes UPDATE/DELETE. Do not grant these permissions.

2. **Service role access** — The service role can still read the log. Be cautious with service role usage.

3. **PII in audit logs** — The `before`/`after` columns may contain PII. Apply the same data governance rules as the source tables.

4. **Log access** — Consider who should be able to read audit logs. Add RLS policies if needed.
