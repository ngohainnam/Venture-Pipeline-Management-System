import * as React from "react"

import { cn } from "@/lib/utils"

type MobileHeaderProps = {
  title: string
  subtitle?: string
  leading?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function MobileHeader({
  title,
  subtitle,
  leading,
  actions,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none",
        className
      )}
    >
      <div className="flex min-h-11 items-center gap-3">
        {leading ? <div className="flex shrink-0 items-center">{leading}</div> : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold leading-6 text-slate-950">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm leading-5 text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}

