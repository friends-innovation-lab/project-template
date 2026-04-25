/**
 * Organization Context Helpers
 *
 * Server-side utilities for managing multi-tenant organization context.
 * Use these in Server Components and Server Actions only.
 *
 * Implements: ENTERPRISE-READINESS.md → "Multi-tenancy architecture"
 * Depends on: 001_organizations_and_org_id.sql migration
 */

import { createClient } from "@/lib/supabase/server";

// ============================================
// TYPES
// ============================================

export interface Organization {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  deleted_at: string | null;
}

export interface OrgMembership {
  org_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
  organization: Organization;
}

// ============================================
// GET CURRENT ORG ID
// ============================================

/**
 * Get the current user's active organization ID.
 *
 * @returns The org_id or null if the user has no active org
 * @throws If the user is not authenticated
 *
 * @example
 * ```ts
 * const orgId = await getCurrentOrgId()
 * if (!orgId) {
 *   redirect('/onboarding') // No org selected
 * }
 * ```
 */
export async function getCurrentOrgId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("user_current_org")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found (not an error, just no current org)
    throw new Error(`Failed to get current org: ${error.message}`);
  }

  return data?.org_id ?? null;
}

// ============================================
// GET CURRENT ORG
// ============================================

/**
 * Get the full organization record for the current user's active org.
 *
 * @returns The organization or null if no active org
 * @throws If the user is not authenticated or org fetch fails
 *
 * @example
 * ```ts
 * const org = await getCurrentOrg()
 * console.log(`Working in: ${org?.name}`)
 * ```
 */
export async function getCurrentOrg(): Promise<Organization | null> {
  const orgId = await getCurrentOrgId();

  if (!orgId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(`Failed to get organization: ${error.message}`);
  }

  return data;
}

// ============================================
// SET CURRENT ORG ID
// ============================================

/**
 * Switch the current user's active organization.
 * Verifies the user is a member of the target org before switching.
 *
 * @param orgId - The organization ID to switch to
 * @throws If user is not authenticated or not a member of the org
 *
 * @example
 * ```ts
 * // In a Server Action
 * 'use server'
 * export async function switchOrg(orgId: string) {
 *   await setCurrentOrgId(orgId)
 *   revalidatePath('/')
 * }
 * ```
 */
export async function setCurrentOrgId(orgId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Verify membership
  const { data: membership, error: membershipError } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) {
    throw new Error("User is not a member of this organization");
  }

  // Upsert current org
  const { error: upsertError } = await supabase.from("user_current_org").upsert(
    {
      user_id: user.id,
      org_id: orgId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  );

  if (upsertError) {
    throw new Error(`Failed to switch organization: ${upsertError.message}`);
  }
}

// ============================================
// GET USER ORGS
// ============================================

/**
 * Get all organizations the current user is a member of.
 *
 * @returns Array of memberships with organization details
 * @throws If user is not authenticated
 *
 * @example
 * ```ts
 * const orgs = await getUserOrgs()
 * // [{ org_id, role, organization: { id, slug, name, ... } }, ...]
 * ```
 */
export async function getUserOrgs(): Promise<OrgMembership[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("org_members")
    .select(
      `
      org_id,
      user_id,
      role,
      created_at,
      organization:organizations!inner (
        id,
        slug,
        name,
        created_at,
        deleted_at
      )
    `,
    )
    .eq("user_id", user.id)
    .is("organizations.deleted_at", null);

  if (error) {
    throw new Error(`Failed to get user organizations: ${error.message}`);
  }

  // Transform the nested organization to match our type
  return (data ?? []).map((row) => ({
    org_id: row.org_id,
    user_id: row.user_id,
    role: row.role as "owner" | "admin" | "member",
    created_at: row.created_at,
    organization: Array.isArray(row.organization)
      ? row.organization[0]
      : row.organization,
  }));
}

// ============================================
// REQUIRE ORG CONTEXT
// ============================================

/**
 * Require an active organization context.
 * Use at the top of pages/actions that require org context.
 *
 * @returns The current organization (never null)
 * @throws If no active org (caller should handle redirect)
 *
 * @example
 * ```ts
 * export default async function DashboardPage() {
 *   const org = await requireOrgContext()
 *   // org is guaranteed to exist
 * }
 * ```
 */
export async function requireOrgContext(): Promise<Organization> {
  const org = await getCurrentOrg();

  if (!org) {
    throw new Error(
      "No active organization. User must select or create an org.",
    );
  }

  return org;
}

// ============================================
// CHECK ORG ROLE
// ============================================

/**
 * Check if the current user has a specific role (or higher) in the current org.
 *
 * Role hierarchy: owner > admin > member
 *
 * @param requiredRole - Minimum role required
 * @returns true if user has the required role or higher
 *
 * @example
 * ```ts
 * const canManageMembers = await hasOrgRole('admin')
 * if (!canManageMembers) {
 *   throw new Error('Insufficient permissions')
 * }
 * ```
 */
export async function hasOrgRole(
  requiredRole: "owner" | "admin" | "member",
): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const orgId = await getCurrentOrgId();
  if (!orgId) return false;

  const { data: membership } = await supabase
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (!membership) return false;

  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  const userLevel =
    roleHierarchy[membership.role as keyof typeof roleHierarchy] ?? 0;
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}
