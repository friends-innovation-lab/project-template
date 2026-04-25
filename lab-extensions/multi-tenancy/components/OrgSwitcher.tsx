"use client";

/**
 * OrgSwitcher Component
 *
 * Header dropdown for switching between organizations.
 * Displays the current org and allows switching to other orgs the user belongs to.
 *
 * Implements: ENTERPRISE-READINESS.md → "Multi-tenancy architecture"
 *
 * @example
 * ```tsx
 * // In your header component
 * import { OrgSwitcher } from '@/components/OrgSwitcher'
 *
 * export function Header() {
 *   return (
 *     <header>
 *       <OrgSwitcher />
 *     </header>
 *   )
 * }
 * ```
 */

import * as React from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================
// TYPES
// ============================================

interface Organization {
  id: string;
  slug: string;
  name: string;
}

interface OrgMembership {
  org_id: string;
  role: "owner" | "admin" | "member";
  organization: Organization;
}

interface OrgSwitcherProps {
  /** Current organization */
  currentOrg: Organization | null;
  /** All organizations the user belongs to */
  userOrgs: OrgMembership[];
  /** Callback when user switches org */
  onSwitchOrg: (orgId: string) => Promise<void>;
  /** Optional className for styling */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function OrgSwitcher({
  currentOrg,
  userOrgs,
  onSwitchOrg,
  className,
}: OrgSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const handleSelect = async (orgId: string) => {
    if (orgId === currentOrg?.id) {
      setIsOpen(false);
      return;
    }

    setIsPending(true);
    try {
      await onSwitchOrg(orgId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch organization:", error);
      // TODO: Show toast error
    } finally {
      setIsPending(false);
    }
  };

  // Role badge colors
  const roleBadgeClass = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (!currentOrg) {
    return (
      <Button
        variant="outline"
        className={cn("w-[200px] justify-start", className)}
        disabled
      >
        <Building2 className="mr-2 h-4 w-4" />
        <span className="text-muted-foreground">No organization</span>
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label={`Current organization: ${currentOrg.name}. Click to switch.`}
          className={cn("w-[200px] justify-between", className)}
          disabled={isPending}
        >
          <div className="flex items-center truncate">
            <Building2 className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{currentOrg.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px]" align="start">
        <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {userOrgs.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No organizations</span>
          </DropdownMenuItem>
        ) : (
          userOrgs.map((membership) => (
            <DropdownMenuItem
              key={membership.org_id}
              onSelect={() => handleSelect(membership.org_id)}
              className="flex items-center justify-between cursor-pointer"
              disabled={isPending}
            >
              <div className="flex items-center min-w-0">
                {membership.org_id === currentOrg.id ? (
                  <Check className="mr-2 h-4 w-4 shrink-0" />
                ) : (
                  <div className="mr-2 h-4 w-4" />
                )}
                <span className="truncate">{membership.organization.name}</span>
              </div>
              <span
                className={cn(
                  "ml-2 text-xs px-1.5 py-0.5 rounded shrink-0",
                  roleBadgeClass(membership.role),
                )}
              >
                {membership.role}
              </span>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            // TODO: Navigate to org creation page
            // eslint-disable-next-line no-console
            console.log("Create new org");
          }}
          className="cursor-pointer"
        >
          <span className="text-muted-foreground">+ Create organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// SERVER WRAPPER (for easy integration)
// ============================================

/**
 * Server Component wrapper that fetches org data.
 * Use this in your layout/header for automatic data fetching.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx or a header component
 * import { OrgSwitcherServer } from '@/components/OrgSwitcher'
 *
 * export default async function Layout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <header>
 *           <OrgSwitcherServer />
 *         </header>
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

// Note: This would be in a separate .server.tsx file in a real project,
// but we include it here for completeness. Move to OrgSwitcher.server.tsx
// and import the client component from ./OrgSwitcher.client.tsx

/*
import { getCurrentOrg, getUserOrgs, setCurrentOrgId } from '@/lib/org-context'
import { revalidatePath } from 'next/cache'
import { OrgSwitcher } from './OrgSwitcher'

export async function OrgSwitcherServer() {
  const [currentOrg, userOrgs] = await Promise.all([
    getCurrentOrg(),
    getUserOrgs(),
  ])

  async function switchOrg(orgId: string) {
    'use server'
    await setCurrentOrgId(orgId)
    revalidatePath('/')
  }

  return (
    <OrgSwitcher
      currentOrg={currentOrg}
      userOrgs={userOrgs}
      onSwitchOrg={switchOrg}
    />
  )
}
*/
