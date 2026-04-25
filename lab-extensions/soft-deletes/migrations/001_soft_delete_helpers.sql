-- ============================================
-- SOFT DELETES EXTENSION
-- Implements: ENTERPRISE-READINESS.md → "Data integrity and recovery"
-- ============================================

-- ============================================
-- HELPER FUNCTION: soft_delete
-- Sets deleted_at = now() for the specified row
-- ============================================

create or replace function soft_delete(target_table text, row_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  execute format(
    'UPDATE public.%I SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL',
    target_table
  ) using row_id;

  -- Return true if a row was affected
  return found;
end;
$$;

comment on function soft_delete(text, uuid) is 'Soft-delete a row by setting deleted_at = now(). Returns true if row was deleted.';

-- ============================================
-- HELPER FUNCTION: restore
-- Sets deleted_at = null for the specified row
-- ============================================

create or replace function restore(target_table text, row_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  execute format(
    'UPDATE public.%I SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL',
    target_table
  ) using row_id;

  -- Return true if a row was affected
  return found;
end;
$$;

comment on function restore(text, uuid) is 'Restore a soft-deleted row by setting deleted_at = null. Returns true if row was restored.';

-- ============================================
-- HELPER FUNCTION: hard_delete
-- Actually deletes the row (with audit log if audit-log extension is applied)
-- Use sparingly — prefer soft delete
-- ============================================

create or replace function hard_delete(target_table text, row_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  row_data jsonb;
  audit_exists boolean;
begin
  -- Check if audit_log table exists
  select exists (
    select 1 from information_schema.tables
    where table_schema = 'public'
      and table_name = 'audit_log'
  ) into audit_exists;

  -- If audit-log extension is applied, log before deleting
  if audit_exists then
    -- Capture the row data before deletion
    execute format(
      'SELECT to_jsonb(t) FROM public.%I t WHERE id = $1',
      target_table
    ) using row_id into row_data;

    if row_data is not null then
      insert into public.audit_log (
        actor_id,
        action,
        resource_type,
        resource_id,
        before,
        after
      ) values (
        auth.uid(),
        target_table || '.hard_delete',
        target_table,
        row_id::text,
        row_data,
        null
      );
    end if;
  end if;

  -- Perform the actual delete
  execute format(
    'DELETE FROM public.%I WHERE id = $1',
    target_table
  ) using row_id;

  return found;
end;
$$;

comment on function hard_delete(text, uuid) is 'Permanently delete a row. Writes to audit_log if audit-log extension is applied. Use sparingly.';

-- ============================================
-- ADD deleted_at TO profiles TABLE
-- Example of the pattern for existing tables
-- ============================================

-- Add column if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'deleted_at'
  ) then
    alter table public.profiles add column deleted_at timestamptz;
  end if;
end $$;

-- Add partial index for active profiles
create index if not exists idx_profiles_active
  on public.profiles(id)
  where deleted_at is null;

-- ============================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================

grant execute on function soft_delete(text, uuid) to authenticated;
grant execute on function restore(text, uuid) to authenticated;
grant execute on function hard_delete(text, uuid) to authenticated;

-- ============================================
-- PATTERN DOCUMENTATION
-- ============================================

-- To add soft-delete to a new table:
--
-- 1. Add the column:
--    ALTER TABLE your_table ADD COLUMN deleted_at timestamptz;
--
-- 2. Add a partial index (IMPORTANT for performance):
--    CREATE INDEX idx_your_table_active ON your_table(id) WHERE deleted_at IS NULL;
--
-- 3. If using multi-tenancy, add org-scoped partial index:
--    CREATE INDEX idx_your_table_org_active ON your_table(org_id) WHERE deleted_at IS NULL;
--
-- 4. Update queries to filter out soft-deleted rows:
--    SELECT * FROM your_table WHERE deleted_at IS NULL;
--
-- 5. Consider updating RLS policies to hide soft-deleted rows from regular users
