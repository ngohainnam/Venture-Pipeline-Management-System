import * as React from "react"

import { cn } from "@/lib/utils"

type MobileLoadingStateProps = {
  label?: string
  className?: string
}

export function MobileLoadingState({
  label = "Loading",
  className,
}: MobileLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-8 text-center",
        className
      )}
    >
      <div className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="text-sm font-medium text-slate-700">{label}</p>
    </div>
  )
}

