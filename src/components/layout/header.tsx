"use client";

import type { User } from "@supabase/supabase-js";
import { MobileSidebar } from "@/components/layout/sidebar";
import { UserMenu } from "@/components/layout/user-menu";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <MobileSidebar />
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
