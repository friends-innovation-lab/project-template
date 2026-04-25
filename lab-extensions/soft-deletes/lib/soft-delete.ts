/**
 * Soft Delete Helpers
 *
 * TypeScript utilities for soft-delete operations.
 * Use these helpers to ensure consistent soft-delete behavior across the application.
 *
 * Implements: ENTERPRISE-READINESS.md → "Data integrity and recovery"
 * Depends on: 001_soft_delete_helpers.sql migration
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

export interface SoftDeletable {
  id: string;
  deleted_at: string | null;
}

export interface SoftDeleteResult {
  success: boolean;
  error?: string;
}

// ============================================
// SOFT DELETE
// ============================================

/**
 * Soft-delete a row by setting deleted_at = now().
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param id - Row ID to soft-delete
 * @returns Result indicating success or failure
 *
 * @example
 * ```ts
 * const result = await softDelete(supabase, 'items', itemId)
 * if (!result.success) {
 *   console.error('Failed to delete:', result.error)
 * }
 * ```
 */
export async function softDelete(
  client: SupabaseClient,
  table: string,
  id: string,
): Promise<SoftDeleteResult> {
  const { error } = await client
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null); // Only delete if not already deleted

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// RESTORE
// ============================================

/**
 * Restore a soft-deleted row by setting deleted_at = null.
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param id - Row ID to restore
 * @returns Result indicating success or failure
 *
 * @example
 * ```ts
 * const result = await restore(supabase, 'items', itemId)
 * if (!result.success) {
 *   console.error('Failed to restore:', result.error)
 * }
 * ```
 */
export async function restore(
  client: SupabaseClient,
  table: string,
  id: string,
): Promise<SoftDeleteResult> {
  const { error } = await client
    .from(table)
    .update({ deleted_at: null })
    .eq("id", id)
    .not("deleted_at", "is", null); // Only restore if actually deleted

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// HARD DELETE
// ============================================

/**
 * Permanently delete a row. Use sparingly.
 *
 * If the audit-log extension is applied, this will log the deletion
 * via the SQL hard_delete() function.
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param id - Row ID to hard-delete
 * @returns Result indicating success or failure
 *
 * @example
 * ```ts
 * // Use sparingly — prefer softDelete
 * const result = await hardDelete(supabase, 'items', itemId)
 * ```
 */
export async function hardDelete(
  client: SupabaseClient,
  table: string,
  id: string,
): Promise<SoftDeleteResult> {
  // Use the SQL function to ensure audit logging if the extension is applied
  const { data, error } = await client.rpc("hard_delete", {
    target_table: table,
    row_id: id,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: data === true };
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Helper to add soft-delete filter to a query.
 *
 * This is a pattern helper — in practice, you'd add this filter directly.
 *
 * @example
 * ```ts
 * // Instead of:
 * const items = await supabase.from('items').select('*')
 *
 * // Do:
 * const items = await supabase
 *   .from('items')
 *   .select('*')
 *   .is('deleted_at', null)
 * ```
 */
export const SOFT_DELETE_FILTER = { deleted_at: null } as const;

/**
 * Check if a row is soft-deleted.
 *
 * @param row - Row with deleted_at field
 * @returns true if the row is soft-deleted
 */
export function isSoftDeleted<T extends SoftDeletable>(row: T): boolean {
  return row.deleted_at !== null;
}

/**
 * Filter out soft-deleted rows from an array.
 *
 * @param rows - Array of rows with deleted_at field
 * @returns Active (non-deleted) rows only
 *
 * @example
 * ```ts
 * const allItems = await fetchAllItems() // May include deleted
 * const activeItems = filterActive(allItems)
 * ```
 */
export function filterActive<T extends SoftDeletable>(rows: T[]): T[] {
  return rows.filter((row) => row.deleted_at === null);
}

/**
 * Filter to only soft-deleted rows from an array.
 *
 * @param rows - Array of rows with deleted_at field
 * @returns Deleted rows only
 *
 * @example
 * ```ts
 * const allItems = await fetchAllItems()
 * const trashedItems = filterDeleted(allItems)
 * ```
 */
export function filterDeleted<T extends SoftDeletable>(rows: T[]): T[] {
  return rows.filter((row) => row.deleted_at !== null);
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Soft-delete multiple rows.
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param ids - Array of row IDs to soft-delete
 * @returns Result with count of deleted rows
 *
 * @example
 * ```ts
 * const result = await bulkSoftDelete(supabase, 'items', [id1, id2, id3])
 * console.log(`Deleted ${result.count} items`)
 * ```
 */
export async function bulkSoftDelete(
  client: SupabaseClient,
  table: string,
  ids: string[],
): Promise<{ success: boolean; count: number; error?: string }> {
  if (ids.length === 0) {
    return { success: true, count: 0 };
  }

  const { error, count } = await client
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids)
    .is("deleted_at", null);

  if (error) {
    return { success: false, count: 0, error: error.message };
  }

  return { success: true, count: count ?? ids.length };
}

/**
 * Restore multiple soft-deleted rows.
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param ids - Array of row IDs to restore
 * @returns Result with count of restored rows
 */
export async function bulkRestore(
  client: SupabaseClient,
  table: string,
  ids: string[],
): Promise<{ success: boolean; count: number; error?: string }> {
  if (ids.length === 0) {
    return { success: true, count: 0 };
  }

  const { error, count } = await client
    .from(table)
    .update({ deleted_at: null })
    .in("id", ids)
    .not("deleted_at", "is", null);

  if (error) {
    return { success: false, count: 0, error: error.message };
  }

  return { success: true, count: count ?? ids.length };
}

// ============================================
// CLEANUP HELPERS
// ============================================

/**
 * Get rows that have been soft-deleted for longer than the specified duration.
 *
 * Useful for scheduled cleanup jobs that hard-delete after retention period.
 *
 * @param client - Supabase client
 * @param table - Table name
 * @param olderThanDays - Days since deletion
 * @returns Array of IDs eligible for hard deletion
 *
 * @example
 * ```ts
 * // Get items deleted more than 30 days ago
 * const oldItems = await getSoftDeletedOlderThan(supabase, 'items', 30)
 * for (const id of oldItems) {
 *   await hardDelete(supabase, 'items', id)
 * }
 * ```
 */
export async function getSoftDeletedOlderThan(
  client: SupabaseClient,
  table: string,
  olderThanDays: number,
): Promise<string[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const { data, error } = await client
    .from(table)
    .select("id")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoffDate.toISOString());

  if (error) {
    throw new Error(`Failed to get old soft-deleted rows: ${error.message}`);
  }

  return (data ?? []).map((row) => row.id);
}
