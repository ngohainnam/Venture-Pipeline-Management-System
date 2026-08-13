"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { signIn } from "next-auth/react";
import { useGlobalSearch } from "@/components/global-search";
import { useAuth } from "@/hooks/useAuth";
import {
  dashboardDesktopNavigationItems,
  isDashboardRouteActive,
} from "@/lib/dashboard-navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const globalSearch = useGlobalSearch();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isActive = (href: string) => isDashboardRouteActive(pathname, href);
  const isExpanded = (title: string) => expandedItems.includes(title);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition-all duration-300",
          isCollapsed && "w-16",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
          <Logo size={isCollapsed ? "sm" : "md"} />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-wide text-sidebar-foreground">
                MIV
              </h1>
              <p className="text-xs font-medium text-sidebar-foreground/65">
                Enterprise Platform
              </p>
            </div>
          )}
        </div>

        {/* Global Search Button */}
        {!isCollapsed && (
          <div className="border-b border-sidebar-border p-4">
            <button
              onClick={globalSearch.open}
              className="group flex w-full items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-4 py-2.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/80 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left text-sm">
                Search everything...
              </span>
              <div className="flex items-center gap-1 text-xs">
                <kbd className="rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 font-mono text-sidebar-foreground/60 transition-colors">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
                </kbd>
                <kbd className="rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 font-mono text-sidebar-foreground/60 transition-colors">
                  K
                </kbd>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {dashboardDesktopNavigationItems.map((item) => (
            <div key={item.title}>
              {/* Main Navigation Item */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar",
                        isActive(item.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 transition-colors" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "group flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                        "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      aria-expanded={isExpanded(item.title)}
                    >
                      <item.icon className="mr-3 h-5 w-5 transition-colors" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>
                  )}

                  {/* Expand/Collapse Button */}
                  {item.children && !isCollapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.title)}
                      aria-label={`${isExpanded(item.title) ? "Collapse" : "Expand"} ${item.title}`}
                      className="ml-1 h-6 w-6 shrink-0 p-0 text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    >
                      {isExpanded(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Sub-navigation Items */}
                {item.children && isExpanded(item.title) && !isCollapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href || child.title}
                        href={child.href || "#"}
                        aria-current={
                          child.href && isActive(child.href) ? "page" : undefined
                        }
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar",
                          child.href && isActive(child.href)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <child.icon className="mr-3 h-4 w-4 transition-colors" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          {!isCollapsed && (
            <div className="space-y-3">
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-sidebar-border bg-sidebar-accent text-xs text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Venture
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-sidebar-border bg-sidebar-accent text-xs text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <BarChart className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>

              

              <div className="flex items-center space-x-3 rounded-md bg-sidebar-accent p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  {isAuthenticated && user ? (
                    <span className="text-sm font-bold">
                      {(
                        user.firstName.charAt(0) + user.lastName.charAt(0)
                      ).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {loading ? (
                    <>
                      <p className="truncate text-sm font-medium text-sidebar-foreground">
                        Loading...
                      </p>
                      <p className="truncate text-xs text-sidebar-foreground/60">
                        Please wait
                      </p>
                    </>
                  ) : isAuthenticated && user ? (
                    <>
                      <p className="truncate text-sm font-medium text-sidebar-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-sidebar-foreground/60">
                        {user.email}
                      </p>
                      <p className="truncate text-[10px] text-sidebar-foreground/45">
                        ID: {user.id}
                      </p>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => signIn()}
                      aria-label="Sign in"
                    >
                      <User className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {isAuthenticated ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={logout}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => (window.location.href = "/auth/login")}
                    aria-label="Sign in"
                  >
                    <User className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-2 w-full text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
