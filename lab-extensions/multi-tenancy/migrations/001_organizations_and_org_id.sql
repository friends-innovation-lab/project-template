-- ============================================
-- MULTI-TENANCY EXTENSION
-- Implements: ENTERPRISE-READINESS.md → "Multi-tenancy architecture"
-- Implements: AI-ASSISTED-DEVELOPMENT.md → "Migration discipline"
-- ============================================

-- ============================================
-- TABLE CREATION (all tables first, before policies)
-- ============================================

-- ORGANIZATIONS TABLE
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz -- Soft-delete support (populated by soft-deletes extension)
);

comment on table public.organizations is 'Multi-tenant organizations. Each org is an isolated data boundary.';
comment on column public.organizations.slug is 'URL-safe unique identifier, e.g., acme-corp';
comment on column public.organizations.deleted_at is 'Soft-delete timestamp. NULL = active, set = deleted.';

-- ORG_MEMBERS TABLE
create table if not exists public.org_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

comment on table public.org_members is 'User membership in organizations with role-based access.';
comment on column public.org_members.role is 'owner: full control, admin: manage members, member: access only';

-- USER_CURRENT_ORG TABLE
-- Tracks each user's active organization
-- Using a lookup table instead of set_config() for pgbouncer compatibility
create table if not exists public.user_current_org (
  user_id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  updated_at timestamptz not null default now()
);

comment on table public.user_current_org is 'Tracks which org each user is currently working in. Used by current_org_id() function.';

-- ============================================
-- ENABLE ROW LEVEL SECURITY (all tables)
-- ============================================

alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.user_current_org enable row level security;

-- ============================================
-- POLICIES: ORGANIZATIONS
-- ============================================

-- Members can view their own organizations
create policy "Members can view their organizations"
  on public.organizations for select
  using (
    exists (
      select 1 from public.org_members
      where org_members.org_id = organizations.id
        and org_members.user_id = auth.uid()
    )
  );

-- Only owners can update their organization
create policy "Owners can update their organization"
  on public.organizations for update
  using (
    exists (
      select 1 from public.org_members
      where org_members.org_id = organizations.id
        and org_members.user_id = auth.uid()
        and org_members.role = 'owner'
    )
  );

-- ============================================
-- POLICIES: ORG_MEMBERS
-- ============================================

-- Members can view other members in their orgs
create policy "Members can view org members"
  on public.org_members for select
  using (
    exists (
      select 1 from public.org_members as my_membership
      where my_membership.org_id = org_members.org_id
        and my_membership.user_id = auth.uid()
    )
  );

-- Owners and admins can manage members
create policy "Owners and admins can manage members"
  on public.org_members for all
  using (
    exists (
      select 1 from public.org_members as my_membership
      where my_membership.org_id = org_members.org_id
        and my_membership.user_id = auth.uid()
        and my_membership.role in ('owner', 'admin')
    )
  );

-- ============================================
-- POLICIES: USER_CURRENT_ORG
-- ============================================

-- Users can only read/write their own current org
create policy "Users manage their own current org"
  on public.user_current_org for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- CURRENT_ORG_ID() FUNCTION
-- Returns the user's active org_id from user_current_org
-- Marked STABLE so Postgres caches within a query
-- ============================================

create or replace function current_org_id()
returns uuid
language sql
stable
security definer
as $$
  select org_id
  from public.user_current_org
  where user_id = auth.uid();
$$;

comment on function current_org_id() is 'Returns the calling user''s active org_id. Use in RLS policies: org_id = current_org_id()';

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_org_members_user_id on public.org_members(user_id);
create index if not exists idx_organizations_slug on public.organizations(slug);
create index if not exists idx_organizations_not_deleted on public.organizations(id) where deleted_at is null;

-- ============================================
-- UPDATE HANDLE_NEW_USER TRIGGER
-- Creates a personal organization on signup
--
-- PATTERN DECISION: Personal org creation is hardcoded to always run.
-- For invite-only flows where users should NOT get a personal org,
-- modify this trigger and document the decision in an ADR.
-- See: lab-extensions/multi-tenancy/README.md
-- ============================================

-- Drop the existing trigger (will be recreated)
drop trigger if exists on_auth_user_created on auth.users;

-- Update the function to also create personal org
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
  user_slug text;
begin
  -- Create profile (existing behavior)
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );

  -- Generate a unique slug from email
  user_slug := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '-', 'g'));
  -- Append random suffix to ensure uniqueness
  user_slug := user_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  -- Create personal organization
  insert into public.organizations (id, slug, name)
  values (
    gen_random_uuid(),
    user_slug,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)) || '''s Workspace'
  )
  returning id into new_org_id;

  -- Add user as owner
  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  -- Set as current org
  insert into public.user_current_org (user_id, org_id)
  values (new.id, new_org_id);

  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- HELPER: SWITCH ORGANIZATION
-- Validates membership before switching
-- ============================================

create or replace function switch_organization(target_org_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  -- Verify user is a member of the target org
  if not exists (
    select 1 from public.org_members
    where org_id = target_org_id
      and user_id = auth.uid()
  ) then
    raise exception 'User is not a member of this organization';
  end if;

  -- Upsert the current org
  insert into public.user_current_org (user_id, org_id, updated_at)
  values (auth.uid(), target_org_id, now())
  on conflict (user_id)
  do update set
    org_id = excluded.org_id,
    updated_at = excluded.updated_at;

  return true;
end;
$$;

comment on function switch_organization(uuid) is 'Switch the calling user''s active organization. Validates membership.';

-- Grant execute to authenticated users
grant execute on function switch_organization(uuid) to authenticated;
grant execute on function current_org_id() to authenticated;
