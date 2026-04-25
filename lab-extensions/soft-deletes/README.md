# Soft Deletes Extension

Implements: `ENTERPRISE-READINESS.md` → "Data integrity and recovery"

## What It Adds

### Column Pattern

- **`deleted_at timestamptz`** — NULL = active, timestamp = soft-deleted

### SQL Functions

- **`soft_delete(table_name, row_id)`** — Sets `deleted_at = now()`
- **`restore(table_name, row_id)`** — Sets `deleted_at = null`
- **`hard_delete(table_name, row_id)`** — Actually deletes (with audit log if audit-log extension is applied)

### TypeScript Helpers

- **`softDelete<T>(client, table, id)`** — Soft-delete a row
- **`restore<T>(client, table, id)`** — Restore a soft-deleted row
- **`hardDelete<T>(client, table, id)`** — Permanently delete (use sparingly)

### Query Patterns

- Default queries exclude soft-deleted rows: `.is('deleted_at', null)`
- Include soft-deleted: `.or('deleted_at.is.null,deleted_at.not.is.null')`

## When to Use It

Use this extension for almost every project:

- **Data recovery** — Users accidentally delete things
- **Audit trails** — Keep history of what existed
- **Compliance** — Some regulations require data retention
- **Debugging** — Understand what happened to missing data

Required by default for: `internal-tool`, `saas-web`, `ai-product`, `federal`

## Dependencies

None — this is standalone.

### Integration with Audit Log

When both extensions are applied:

- `hard_delete()` writes an audit log entry before actual deletion
- Soft-deletes themselves are logged as updates (before: row, after: row with deleted_at)

## Files Added to Project

```
supabase/migrations/
  XXXXXXXX_soft_delete_helpers.sql  # Helper functions

src/lib/
  soft-delete.ts                     # TypeScript helpers
```

## Files Modified

The migration adds `deleted_at` to the `profiles` table as an example. For your own tables:

1. Add the column: `ALTER TABLE your_table ADD COLUMN deleted_at timestamptz;`
2. Add a partial index: `CREATE INDEX idx_your_table_active ON your_table(id) WHERE deleted_at IS NULL;`
3. Update queries to filter: `.is('deleted_at', null)`

## Pattern Guide

### Creating Tables with Soft Delete

```sql
create table public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz  -- NULL = active, set = soft-deleted
);

-- Partial index for active rows (IMPORTANT for performance)
create index idx_items_active on public.items(id) where deleted_at is null;

-- If also using multi-tenancy
create index idx_items_org_active
  on public.items(org_id)
  where deleted_at is null;
```

### Querying with Soft Delete

```typescript
// Default: exclude soft-deleted rows
const { data } = await supabase
  .from("items")
  .select("*")
  .is("deleted_at", null);

// Include soft-deleted rows (admin view)
const { data: allItems } = await supabase.from("items").select("*");
// No filter on deleted_at

// Only soft-deleted rows (trash view)
const { data: deletedItems } = await supabase
  .from("items")
  .select("*")
  .not("deleted_at", "is", null);
```

### Soft Deleting

```typescript
import { softDelete } from "@/lib/soft-delete";

// Via helper
await softDelete(supabase, "items", itemId);

// Or directly
await supabase
  .from("items")
  .update({ deleted_at: new Date().toISOString() })
  .eq("id", itemId);
```

### Restoring

```typescript
import { restore } from "@/lib/soft-delete";

// Via helper
await restore(supabase, "items", itemId);

// Or directly
await supabase.from("items").update({ deleted_at: null }).eq("id", itemId);
```

### Hard Deleting (Rare)

```typescript
import { hardDelete } from "@/lib/soft-delete";

// Via helper (writes audit log if audit-log extension is applied)
await hardDelete(supabase, "items", itemId);

// Or directly (NO audit log)
await supabase.from("items").delete().eq("id", itemId);
```

## RLS Considerations

Soft-deleted rows are still subject to RLS. Common patterns:

### Hide Soft-Deleted from Regular Users

```sql
create policy "Users see active items"
  on items for select
  using (
    deleted_at is null
    and user_id = auth.uid()
  );
```

### Allow Admins to See Soft-Deleted

```sql
create policy "Admins see all items"
  on items for select
  using (
    user_id = auth.uid()
    or is_admin(auth.uid())
  );
```

### Prevent Accidental Hard Delete

```sql
-- Revoke DELETE from regular users
revoke delete on items from authenticated;

-- Only allow through the hard_delete function (which logs)
-- Or require admin role for DELETE
```

## Migration Path

### Fresh Projects

Spinup script:

1. Copies migration to `supabase/migrations/`
2. Copies lib files to `src/lib/`
3. Runs `supabase db push`

### Retrofit Projects

For each table:

1. **Add column (nullable)**

   ```sql
   ALTER TABLE your_table ADD COLUMN deleted_at timestamptz;
   ```

2. **Update queries** — Add `.is('deleted_at', null)` to all SELECT queries

3. **Add partial index**

   ```sql
   CREATE INDEX idx_your_table_active ON your_table(id) WHERE deleted_at IS NULL;
   ```

4. **Deploy and verify** — Confirm queries still work correctly

5. **Update RLS policies** — If needed, add `deleted_at is null` to policies

## Performance Considerations

### Partial Indexes Are Critical

Without a partial index, queries that filter `WHERE deleted_at IS NULL` scan the entire table. With a partial index, they use the index.

```sql
-- BAD: no partial index
SELECT * FROM items WHERE deleted_at IS NULL;
-- → Full table scan

-- GOOD: partial index exists
CREATE INDEX idx_items_active ON items(id) WHERE deleted_at IS NULL;
SELECT * FROM items WHERE deleted_at IS NULL;
-- → Index scan (fast)
```

### Vacuum and Bloat

Soft-deleted rows still take up space. For tables with high deletion rates, consider:

1. **Scheduled hard-delete job** — After retention period, actually delete
2. **Table partitioning** — Partition by time, drop old partitions
3. **Regular VACUUM** — Reclaim space from actual hard deletes

## Anti-Patterns

```typescript
// BAD: Forgetting to filter soft-deleted rows
const items = await supabase.from("items").select("*");
// → Includes deleted items!

// BAD: Using regular delete instead of soft delete
await supabase.from("items").delete().eq("id", id);
// → Data is gone forever

// BAD: Restoring without checking if it was deleted
await restore(supabase, "items", id);
// → Should verify row is actually soft-deleted first

// BAD: No partial index
// → Performance degrades as deleted rows accumulate
```
