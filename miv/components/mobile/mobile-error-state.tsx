import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type MobileErrorStateProps = {
  title?: string
  message: string
  action?: React.ReactNode
  className?: string
}

export function MobileErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: MobileErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-red-200 bg-red-50 px-4 py-4 text-red-950",
        className
      )}
    >
      <div className="flex gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-red-800">{message}</p>
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  )
}

