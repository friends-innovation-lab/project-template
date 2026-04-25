-- ============================================
-- RLS POLICY PATTERNS FOR ORG-SCOPED TABLES
-- Implements: ENTERPRISE-READINESS.md → "Multi-tenancy architecture"
-- ============================================
--
-- This file contains copy-paste-ready SQL templates for adding
-- multi-tenancy support to new tables.
--
-- For each new table that stores org-specific data:
-- 1. Add org_id column
-- 2. Enable RLS
-- 3. Add policies using current_org_id()
--
-- The current_org_id() function returns the user's active org_id
-- from the user_current_org lookup table.
--
-- ============================================

-- ============================================
-- TEMPLATE: Create an org-scoped table
-- ============================================

-- Replace 'your_table' with your actual table name
-- Replace the columns with your actual schema

/*
create table public.your_table (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,

  -- Your columns here
  name text not null,
  description text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz -- If using soft-deletes extension
);

-- Enable RLS (REQUIRED)
alter table public.your_table enable row level security;

-- Members can view rows in their current org
create policy "Members can view org data"
  on public.your_table for select
  using (org_id = current_org_id());

-- Members can insert rows in their current org
create policy "Members can insert org data"
  on public.your_table for insert
  with check (org_id = current_org_id());

-- Members can update rows in their current org
create policy "Members can update org data"
  on public.your_table for update
  using (org_id = current_org_id());

-- Members can delete rows in their current org
-- (Consider using soft-deletes instead of hard delete)
create policy "Members can delete org data"
  on public.your_table for delete
  using (org_id = current_org_id());

-- Index for org_id queries (IMPORTANT for performance)
create index idx_your_table_org_id on public.your_table(org_id);

-- Partial index excluding soft-deleted rows (if using soft-deletes)
create index idx_your_table_org_active
  on public.your_table(org_id)
  where deleted_at is null;

-- Updated_at trigger
create trigger your_table_updated_at
  before update on public.your_table
  for each row execute procedure public.handle_updated_at();
*/

-- ============================================
-- TEMPLATE: Role-based policies
-- ============================================

-- For tables where only admins/owners can write:

/*
-- Anyone in the org can read
create policy "Members can view"
  on public.settings for select
  using (org_id = current_org_id());

-- Only admins and owners can write
create policy "Admins can modify"
  on public.settings for all
  using (
    org_id = current_org_id()
    and exists (
      select 1 from public.org_members
      where org_id = current_org_id()
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );
*/

-- ============================================
-- TEMPLATE: User-owned within org
-- ============================================

-- For tables where users can only modify their own rows:

/*
-- Members can view all rows in their org
create policy "Members can view org data"
  on public.user_tasks for select
  using (org_id = current_org_id());

-- Users can only insert their own rows
create policy "Users can insert own data"
  on public.user_tasks for insert
  with check (
    org_id = current_org_id()
    and user_id = auth.uid()
  );

-- Users can only update their own rows
create policy "Users can update own data"
  on public.user_tasks for update
  using (
    org_id = current_org_id()
    and user_id = auth.uid()
  );

-- Users can only delete their own rows
create policy "Users can delete own data"
  on public.user_tasks for delete
  using (
    org_id = current_org_id()
    and user_id = auth.uid()
  );
*/

-- ============================================
-- HELPER: Add org_id to existing table
-- ============================================

-- Use this pattern when retrofitting an existing table:

/*
-- Step 1: Add nullable column
alter table public.existing_table
  add column org_id uuid references public.organizations(id);

-- Step 2: Backfill (set to user's personal org)
update public.existing_table t
set org_id = (
  select om.org_id
  from public.org_members om
  where om.user_id = t.user_id
    and om.role = 'owner'
  limit 1
);

-- Step 3: Make NOT NULL
alter table public.existing_table
  alter column org_id set not null;

-- Step 4: Add index
create index idx_existing_table_org_id on public.existing_table(org_id);

-- Step 5: Add RLS policies (see templates above)
*/

-- ============================================
-- HELPER: Verify isolation
-- ============================================

-- Run this query to check for any rows visible across orgs:

/*
-- Should return 0 if isolation is working
select count(*)
from public.your_table t
where t.org_id != current_org_id();
*/

-- ============================================
-- ANTI-PATTERNS (Don't do these)
-- ============================================

/*
-- BAD: Forgetting org_id in INSERT check
create policy "Bad insert policy"
  on public.items for insert
  with check (true);  -- Allows inserting to ANY org!

-- BAD: Using auth.uid() directly without org context
create policy "Bad user policy"
  on public.items for select
  using (user_id = auth.uid());  -- Misses org isolation!

-- BAD: Not indexing org_id
-- Without index, RLS checks cause full table scans

-- BAD: Trusting client-provided org_id
-- Always use current_org_id() from server context
*/

-- ============================================
-- NOTES
-- ============================================

-- 1. current_org_id() is marked STABLE, so Postgres caches it within a query.
--    This means multiple RLS checks in one query only hit user_current_org once.

-- 2. For bulk operations, consider using a service role client that bypasses RLS,
--    with explicit org_id filtering in your application code.

-- 3. The profiles table is intentionally NOT org-scoped. Users exist across all
--    orgs they're members of. Only org-specific data gets org_id.

-- 4. If you need cross-org reads (e.g., admin dashboards), create a separate
--    policy that checks for a super-admin role, not a bypass of org isolation.
