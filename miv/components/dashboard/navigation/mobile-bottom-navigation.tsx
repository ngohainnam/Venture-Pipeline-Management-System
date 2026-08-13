"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  dashboardMobileBottomItems,
  isDashboardRouteActive,
} from "@/lib/dashboard-navigation";

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 text-card-foreground backdrop-blur lg:hidden"
      aria-label="Mobile dashboard bottom navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {dashboardMobileBottomItems.map((item) => {
          if (!item.href) return null;

          const active = isDashboardRouteActive(pathname, item.href);

          return (
            <Link
              key={item.title}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
