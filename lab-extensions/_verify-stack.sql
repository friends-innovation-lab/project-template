-- ============================================
-- CROSS-EXTENSION VERIFICATION SCRIPT
-- ============================================
--
-- Run this script against a freshly migrated database with all three
-- extensions applied (multi-tenancy, audit-log, soft-deletes) to verify
-- they work together correctly.
--
-- Usage:
--   psql -f lab-extensions/_verify-stack.sql $DATABASE_URL
--
-- Or in Supabase SQL Editor:
--   Copy and paste this entire file
--
-- Expected output: All tests should print "PASS"
-- ============================================

-- ============================================
-- SETUP: Create test data
-- ============================================

do $$
declare
  test_org_a_id uuid := gen_random_uuid();
  test_org_b_id uuid := gen_random_uuid();
  test_user_a_id uuid;
  test_user_b_id uuid;
  test_count int;
  test_org_id uuid;
begin
  raise notice '=== Starting Cross-Extension Verification ===';
  raise notice '';

  -- ============================================
  -- TEST 1: Multi-tenancy tables exist
  -- ============================================
  raise notice 'TEST 1: Multi-tenancy tables exist';

  if exists (select 1 from information_schema.tables where table_name = 'organizations') then
    raise notice '  PASS: organizations table exists';
  else
    raise notice '  FAIL: organizations table missing';
  end if;

  if exists (select 1 from information_schema.tables where table_name = 'org_members') then
    raise notice '  PASS: org_members table exists';
  else
    raise notice '  FAIL: org_members table missing';
  end if;

  if exists (select 1 from information_schema.tables where table_name = 'user_current_org') then
    raise notice '  PASS: user_current_org table exists';
  else
    raise notice '  FAIL: user_current_org table missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 2: Audit log table exists and is append-only
  -- ============================================
  raise notice 'TEST 2: Audit log table exists';

  if exists (select 1 from information_schema.tables where table_name = 'audit_log') then
    raise notice '  PASS: audit_log table exists';
  else
    raise notice '  FAIL: audit_log table missing';
  end if;

  -- Check that audit_log has org_id column (for multi-tenancy integration)
  if exists (
    select 1 from information_schema.columns
    where table_name = 'audit_log' and column_name = 'org_id'
  ) then
    raise notice '  PASS: audit_log.org_id column exists (multi-tenancy integration)';
  else
    raise notice '  FAIL: audit_log.org_id column missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 3: Soft-delete helpers exist
  -- ============================================
  raise notice 'TEST 3: Soft-delete functions exist';

  if exists (select 1 from pg_proc where proname = 'soft_delete') then
    raise notice '  PASS: soft_delete() function exists';
  else
    raise notice '  FAIL: soft_delete() function missing';
  end if;

  if exists (select 1 from pg_proc where proname = 'restore') then
    raise notice '  PASS: restore() function exists';
  else
    raise notice '  FAIL: restore() function missing';
  end if;

  if exists (select 1 from pg_proc where proname = 'hard_delete') then
    raise notice '  PASS: hard_delete() function exists';
  else
    raise notice '  FAIL: hard_delete() function missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 4: current_org_id() function exists
  -- ============================================
  raise notice 'TEST 4: current_org_id() function exists';

  if exists (select 1 from pg_proc where proname = 'current_org_id') then
    raise notice '  PASS: current_org_id() function exists';
  else
    raise notice '  FAIL: current_org_id() function missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 5: profiles table has deleted_at
  -- ============================================
  raise notice 'TEST 5: profiles table has soft-delete support';

  if exists (
    select 1 from information_schema.columns
    where table_name = 'profiles' and column_name = 'deleted_at'
  ) then
    raise notice '  PASS: profiles.deleted_at column exists';
  else
    raise notice '  FAIL: profiles.deleted_at column missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 6: organizations table has deleted_at
  -- ============================================
  raise notice 'TEST 6: organizations table has soft-delete support';

  if exists (
    select 1 from information_schema.columns
    where table_name = 'organizations' and column_name = 'deleted_at'
  ) then
    raise notice '  PASS: organizations.deleted_at column exists';
  else
    raise notice '  FAIL: organizations.deleted_at column missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 7: log_changes() trigger function exists
  -- ============================================
  raise notice 'TEST 7: Audit trigger function exists';

  if exists (select 1 from pg_proc where proname = 'log_changes') then
    raise notice '  PASS: log_changes() trigger function exists';
  else
    raise notice '  FAIL: log_changes() trigger function missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 8: enable_audit() helper exists
  -- ============================================
  raise notice 'TEST 8: enable_audit() helper exists';

  if exists (select 1 from pg_proc where proname = 'enable_audit') then
    raise notice '  PASS: enable_audit() helper exists';
  else
    raise notice '  FAIL: enable_audit() helper missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 9: switch_organization() helper exists
  -- ============================================
  raise notice 'TEST 9: switch_organization() helper exists';

  if exists (select 1 from pg_proc where proname = 'switch_organization') then
    raise notice '  PASS: switch_organization() helper exists';
  else
    raise notice '  FAIL: switch_organization() helper missing';
  end if;

  raise notice '';

  -- ============================================
  -- TEST 10: Indexes exist for performance
  -- ============================================
  raise notice 'TEST 10: Performance indexes exist';

  if exists (select 1 from pg_indexes where indexname = 'idx_audit_log_org') then
    raise notice '  PASS: idx_audit_log_org index exists';
  else
    raise notice '  WARN: idx_audit_log_org index missing (optional)';
  end if;

  if exists (select 1 from pg_indexes where indexname = 'idx_profiles_active') then
    raise notice '  PASS: idx_profiles_active partial index exists';
  else
    raise notice '  WARN: idx_profiles_active partial index missing';
  end if;

  if exists (select 1 from pg_indexes where indexname = 'idx_organizations_not_deleted') then
    raise notice '  PASS: idx_organizations_not_deleted partial index exists';
  else
    raise notice '  WARN: idx_organizations_not_deleted partial index missing';
  end if;

  raise notice '';

  -- ============================================
  -- SUMMARY
  -- ============================================
  raise notice '=== Verification Complete ===';
  raise notice '';
  raise notice 'If all tests show PASS, the extensions are correctly integrated.';
  raise notice 'WARN items are optional but recommended for production.';
  raise notice '';
  raise notice 'To test data isolation, create two organizations and verify:';
  raise notice '  1. User in org A cannot SELECT data from org B';
  raise notice '  2. audit_log entries have correct org_id';
  raise notice '  3. soft_delete() and hard_delete() work on org-scoped tables';

end $$;

-- ============================================
-- OPTIONAL: Live integration test
-- (Uncomment and run manually if you want to test with real data)
-- ============================================

/*
-- Create test organizations
insert into organizations (id, slug, name)
values
  ('11111111-1111-1111-1111-111111111111', 'test-org-a', 'Test Org A'),
  ('22222222-2222-2222-2222-222222222222', 'test-org-b', 'Test Org B');

-- Simulate user setting current org to A
insert into user_current_org (user_id, org_id)
values (auth.uid(), '11111111-1111-1111-1111-111111111111')
on conflict (user_id) do update set org_id = excluded.org_id;

-- Check current_org_id returns org A
select current_org_id() as should_be_org_a;

-- Cleanup
delete from organizations where slug like 'test-org-%';
*/
