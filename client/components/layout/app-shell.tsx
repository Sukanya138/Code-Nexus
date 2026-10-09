"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";

export function BrandMark(): React.JSX.Element {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        CN
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
          CodeNexus
        </span>
        <span className="text-xs text-muted-foreground">Developer workspace</span>
      </span>
    </Link>
  );
}

export function GhostButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function AppShell({
  children,
  title,
  description,
  actions,
  hideHeader = false,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  hideHeader?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  async function handleLogout() {
    // Open GitHub logout in a new tab (fallback interactive sign-out)
    try {
      const win = window.open("https://github.com/logout", "_blank", "noopener,noreferrer");
      // call backend logout and clear local cookie
      await logout.mutateAsync();
      // ensure client cookie cleared by the mutation's success handler
      // then redirect current tab to login
      router.push("/login");
      // optional: focus the new window if available
      if (win) win.focus();
    } catch (e) {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-72 flex-shrink-0 border-r bg-surface sticky top-0 self-start h-screen">
        <div className="flex h-full flex-col">
          <div className="px-6 py-6">
            <BrandMark />
          </div>

          <nav className="flex-1 px-2 pb-4">
            {dashboardNavGroups.map((group) => (
              <div key={group.label} className="mb-6">
                <div className="px-3 mb-2 text-xs font-medium text-muted-foreground">{group.label}</div>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isDashboardNavActive(pathname, item.href, !!item.exact);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm",
                            active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="px-4 py-4 border-t">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="w-full p-0" aria-label="Open profile menu">
                      <div className="flex items-center gap-3 w-full text-left">
                        <Avatar>
                          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName ?? user.githubUsername} /> : null}
                          <AvatarFallback>{(user.displayName || user.githubUsername || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{user.displayName ?? user.githubUsername}</div>
                          <div className="text-xs text-muted-foreground">{user.githubUsername}</div>
                        </div>
                      </div>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="block text-sm">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}