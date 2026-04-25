-- ============================================
-- AUDIT LOG EXTENSION
-- Implements: ENTERPRISE-READINESS.md → "Audit and observability"
-- Implements: DATA-GOVERNANCE.md → "Retention policies"
-- ============================================

-- ============================================
-- AUDIT_LOG TABLE
-- Append-only log of all auditable events
-- ============================================

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Who performed the action (NULL for system/anonymous actions)
  actor_id uuid references auth.users(id) on delete set null,

  -- What happened
  action text not null,           -- e.g., 'user.login', 'item.created', 'item.updated'
  resource_type text not null,    -- e.g., 'user', 'item', 'organization'
  resource_id text not null,      -- ID of the affected resource

  -- State changes
  before jsonb,                   -- State before change (for update/delete)
  after jsonb,                    -- State after change (for insert/update)

  -- Context
  ip inet,                        -- Client IP address
  user_agent text,                -- Client user agent
  org_id uuid,                    -- Organization context (if multi-tenancy is applied)
  metadata jsonb                  -- Additional event-specific data
);

-- Retention policy documentation
comment on table public.audit_log is 'Append-only audit log. Retention: 7 years per DATA-GOVERNANCE.md. Do not DELETE or UPDATE rows.';
comment on column public.audit_log.actor_id is 'User who performed the action. NULL for system actions.';
comment on column public.audit_log.org_id is 'Organization context. Auto-populated from current_org_id() if multi-tenancy extension is applied.';

-- ============================================
-- MAKE AUDIT_LOG APPEND-ONLY
-- Revoke UPDATE and DELETE from all roles
-- ============================================

-- Revoke modification permissions
revoke update, delete on public.audit_log from public;
revoke update, delete on public.audit_log from authenticated;
revoke update, delete on public.audit_log from anon;

-- Note: service_role can still modify (Supabase limitation)
-- Application code must never use service_role to modify audit_log

-- Grant SELECT to authenticated users (consider adding RLS for org isolation)
grant select on public.audit_log to authenticated;

-- Grant INSERT for the audit() function and triggers
grant insert on public.audit_log to authenticated;

-- ============================================
-- INDEXES FOR COMMON QUERIES
-- ============================================

-- Query by actor
create index if not exists idx_audit_log_actor
  on public.audit_log (actor_id, created_at desc)
  where actor_id is not null;

-- Query by resource
create index if not exists idx_audit_log_resource
  on public.audit_log (resource_type, resource_id, created_at desc);

-- Query by org (if multi-tenancy is applied)
create index if not exists idx_audit_log_org
  on public.audit_log (org_id, created_at desc)
  where org_id is not null;

-- Query recent events
create index if not exists idx_audit_log_recent
  on public.audit_log (created_at desc);

-- Query by action type
create index if not exists idx_audit_log_action
  on public.audit_log (action, created_at desc);

-- ============================================
-- RLS POLICIES (optional, enable if needed)
-- ============================================

-- Enable RLS but allow authenticated users to read all logs by default
-- Uncomment and modify if you need org-scoped audit log access

alter table public.audit_log enable row level security;

-- Default: authenticated users can read all audit logs
create policy "Authenticated users can read audit logs"
  on public.audit_log for select
  to authenticated
  using (true);

-- Alternative: Org-scoped audit logs (uncomment if multi-tenancy is applied)
-- create policy "Members can read their org's audit logs"
--   on public.audit_log for select
--   to authenticated
--   using (
--     org_id is null  -- System events visible to all
--     or org_id = current_org_id()  -- Org events visible to members
--   );

-- INSERT policy: anyone can create audit entries via triggers/helpers
create policy "Audit entries can be inserted"
  on public.audit_log for insert
  to authenticated
  with check (true);

-- ============================================
-- GENERIC TRIGGER FUNCTION FOR ROW-LEVEL AUDITING
-- ============================================

create or replace function log_changes()
returns trigger
language plpgsql
security definer
as $$
declare
  audit_action text;
  audit_before jsonb;
  audit_after jsonb;
  audit_org_id uuid;
begin
  -- Determine action type
  if (TG_OP = 'INSERT') then
    audit_action := TG_TABLE_NAME || '.insert';
    audit_before := null;
    audit_after := to_jsonb(NEW);
  elsif (TG_OP = 'UPDATE') then
    audit_action := TG_TABLE_NAME || '.update';
    audit_before := to_jsonb(OLD);
    audit_after := to_jsonb(NEW);
  elsif (TG_OP = 'DELETE') then
    audit_action := TG_TABLE_NAME || '.delete';
    audit_before := to_jsonb(OLD);
    audit_after := null;
  end if;

  -- Try to get org_id from current_org_id() if it exists
  -- Falls back to null if multi-tenancy is not applied
  begin
    audit_org_id := current_org_id();
  exception when undefined_function then
    audit_org_id := null;
  end;

  -- Insert audit log entry
  insert into public.audit_log (
    actor_id,
    action,
    resource_type,
    resource_id,
    before,
    after,
    org_id
  ) values (
    auth.uid(),
    audit_action,
    TG_TABLE_NAME,
    coalesce(
      (NEW).id::text,
      (OLD).id::text,
      'unknown'
    ),
    audit_before,
    audit_after,
    audit_org_id
  );

  -- Return appropriate value for trigger
  if (TG_OP = 'DELETE') then
    return OLD;
  else
    return NEW;
  end if;
end;
$$;

comment on function log_changes() is 'Generic trigger function for automatic row-level auditing. Attach to tables via enable_audit().';

-- ============================================
-- HELPER: ENABLE AUDITING FOR A TABLE
-- ============================================

create or replace function enable_audit(target_table text)
returns void
language plpgsql
as $$
declare
  trigger_name text;
begin
  trigger_name := 'audit_' || target_table;

  -- Drop existing trigger if present
  execute format('DROP TRIGGER IF EXISTS %I ON public.%I', trigger_name, target_table);

  -- Create new trigger
  execute format('
    CREATE TRIGGER %I
    AFTER INSERT OR UPDATE OR DELETE ON public.%I
    FOR EACH ROW EXECUTE FUNCTION log_changes()
  ', trigger_name, target_table);

  raise notice 'Audit enabled for table: %', target_table;
end;
$$;

comment on function enable_audit(text) is 'Attach the log_changes() trigger to a table for automatic auditing.';

-- ============================================
-- HELPER: DISABLE AUDITING FOR A TABLE
-- ============================================

create or replace function disable_audit(target_table text)
returns void
language plpgsql
as $$
declare
  trigger_name text;
begin
  trigger_name := 'audit_' || target_table;

  execute format('DROP TRIGGER IF EXISTS %I ON public.%I', trigger_name, target_table);

  raise notice 'Audit disabled for table: %', target_table;
end;
$$;

comment on function disable_audit(text) is 'Remove the audit trigger from a table.';

-- ============================================
-- RETENTION POLICY (Documentation Only)
-- ============================================

-- Per DATA-GOVERNANCE.md, audit_log rows should be retained for 7 years.
-- Actual deletion should be handled by a scheduled job, not in this migration.
--
-- Example partition strategy for high-volume deployments:
--
-- CREATE TABLE audit_log_2024 PARTITION OF audit_log
--   FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
--
-- Partitioning allows efficient deletion of old data:
-- DROP TABLE audit_log_2017;  -- Drop entire year at once
--
-- For lower-volume deployments, a simple scheduled delete:
-- DELETE FROM audit_log WHERE created_at < now() - interval '7 years';

-- ============================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================

grant execute on function enable_audit(text) to authenticated;
grant execute on function disable_audit(text) to authenticated;
