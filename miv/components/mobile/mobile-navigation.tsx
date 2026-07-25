"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type MobileNavigationItem = {
  label: string
  href: string
  icon: LucideIcon
}

type MobileNavigationProps = {
  items: MobileNavigationItem[]
  label?: string
  className?: string
}

export function MobileNavigation({
  items,
  label = "Mobile navigation",
  className,
}: MobileNavigationProps) {
  const pathname = usePathname()

  if (items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={label}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/85 lg:hidden",
        className
      )}
    >
      <div
        className="mx-auto grid max-w-md gap-1"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`))

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
                isActive && "bg-slate-100 text-slate-950"
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
