import * as React from "react"

import { cn } from "@/lib/utils"

type MobileEmptyStateProps = {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function MobileEmptyState({
  title,
  description,
  icon,
  action,
  className,
}: MobileEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center",
        className
      )}
    >
      {icon ? <div className="mb-3 text-slate-500">{icon}</div> : null}
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-xs text-sm leading-5 text-slate-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

