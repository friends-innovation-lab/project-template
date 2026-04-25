/**
 * Audit Log Helper
 *
 * Application-level audit logging for events that database triggers can't capture.
 * Use for: login attempts, permission changes, data exports, admin actions.
 *
 * Implements: ENTERPRISE-READINESS.md → "Audit and observability"
 * Depends on: 001_audit_log.sql migration
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// ============================================
// TYPES
// ============================================

export interface AuditEvent {
  /** Action identifier (e.g., 'user.login', 'data.export') */
  action: string;
  /** Type of resource affected (e.g., 'user', 'report') */
  resourceType: string;
  /** ID of the affected resource */
  resourceId: string;
  /** State before the change (optional) */
  before?: Record<string, unknown>;
  /** State after the change (optional) */
  after?: Record<string, unknown>;
  /** Additional event-specific data */
  metadata?: Record<string, unknown>;
  /** Override actor_id (defaults to current user) */
  actorId?: string | null;
}

export interface AuditLogEntry {
  id: string;
  created_at: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  org_id: string | null;
  metadata: Record<string, unknown> | null;
}

// ============================================
// AUDIT FUNCTION
// ============================================

/**
 * Log an audit event.
 *
 * Use this for application-level events that database triggers can't capture:
 * - Authentication events (login, logout, failed attempts)
 * - Permission changes
 * - Data exports
 * - Admin actions
 *
 * @example
 * ```ts
 * // Log a successful login
 * await audit({
 *   action: 'user.login',
 *   resourceType: 'user',
 *   resourceId: userId,
 *   metadata: { method: 'magic-link', success: true }
 * })
 *
 * // Log a failed login attempt
 * await audit({
 *   action: 'user.login_failed',
 *   resourceType: 'user',
 *   resourceId: email, // Use email since we don't have user ID
 *   metadata: { reason: 'invalid_password', attempt: 3 },
 *   actorId: null // No authenticated user
 * })
 *
 * // Log a data export
 * await audit({
 *   action: 'data.export',
 *   resourceType: 'report',
 *   resourceId: reportId,
 *   metadata: { format: 'csv', rowCount: 1500 }
 * })
 * ```
 */
export async function audit(event: AuditEvent): Promise<void> {
  const supabase = await createClient();

  // Get current user (may be null for anonymous events)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get request context
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headersList.get("user-agent") ?? null;

  // Try to get org_id from current_org_id() if multi-tenancy is applied
  // Falls back to null if the function doesn't exist or returns null
  let orgId: string | null = null;
  try {
    const { data: orgData } = await supabase.rpc("current_org_id");
    orgId = orgData ?? null;
  } catch {
    // current_org_id() doesn't exist (multi-tenancy not applied) or returned null
    // This is expected for system events or pre-org-creation events
    orgId = null;
  }

  // Determine actor_id
  const actorId =
    event.actorId !== undefined ? event.actorId : (user?.id ?? null);

  // Insert audit log entry
  const { error } = await supabase.from("audit_log").insert({
    actor_id: actorId,
    action: event.action,
    resource_type: event.resourceType,
    resource_id: event.resourceId,
    before: event.before ?? null,
    after: event.after ?? null,
    ip,
    user_agent: userAgent,
    org_id: orgId,
    metadata: event.metadata ?? null,
  });

  if (error) {
    // Log the error but don't throw — audit logging should not break the application
    console.error("[audit] Failed to write audit log:", error.message);
    console.error("[audit] Event:", JSON.stringify(event));
  }
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Get recent audit events for a resource.
 *
 * @example
 * ```ts
 * const history = await getResourceAuditHistory('user', userId, 50)
 * ```
 */
export async function getResourceAuditHistory(
  resourceType: string,
  resourceId: string,
  limit = 50,
): Promise<AuditLogEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .eq("resource_type", resourceType)
    .eq("resource_id", resourceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to get audit history: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Get recent audit events by a specific actor.
 *
 * @example
 * ```ts
 * const activity = await getActorAuditHistory(userId, 100)
 * ```
 */
export async function getActorAuditHistory(
  actorId: string,
  limit = 50,
): Promise<AuditLogEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .eq("actor_id", actorId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to get actor audit history: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Get recent audit events for the current organization.
 * Requires multi-tenancy extension.
 *
 * @example
 * ```ts
 * const orgActivity = await getOrgAuditHistory(100)
 * ```
 */
export async function getOrgAuditHistory(limit = 50): Promise<AuditLogEntry[]> {
  const supabase = await createClient();

  // Get current org
  let orgId: string | null = null;
  try {
    const { data: orgData } = await supabase.rpc("current_org_id");
    orgId = orgData ?? null;
  } catch {
    throw new Error("Multi-tenancy extension not applied or no current org");
  }

  if (!orgId) {
    throw new Error("No current organization");
  }

  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to get org audit history: ${error.message}`);
  }

  return data ?? [];
}

// ============================================
// COMMON ACTION CONSTANTS
// ============================================

/**
 * Standard action names for consistency across the application.
 * Use these or follow the pattern: `{resource}.{verb}` or `{resource}.{verb}_{detail}`
 */
export const AUDIT_ACTIONS = {
  // Authentication
  USER_LOGIN: "user.login",
  USER_LOGIN_FAILED: "user.login_failed",
  USER_LOGOUT: "user.logout",
  USER_SIGNUP: "user.signup",
  USER_PASSWORD_RESET: "user.password_reset",

  // User management
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",

  // Organization (if multi-tenancy)
  ORG_CREATED: "org.created",
  ORG_UPDATED: "org.updated",
  ORG_DELETED: "org.deleted",
  ORG_MEMBER_ADDED: "org.member_added",
  ORG_MEMBER_REMOVED: "org.member_removed",
  ORG_MEMBER_ROLE_CHANGED: "org.member_role_changed",

  // Data operations
  DATA_EXPORT: "data.export",
  DATA_IMPORT: "data.import",

  // Admin actions
  ADMIN_IMPERSONATE: "admin.impersonate",
  ADMIN_CONFIG_CHANGED: "admin.config_changed",
} as const;
