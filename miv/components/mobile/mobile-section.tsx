import * as React from "react"

import { cn } from "@/lib/utils"

type MobileSectionProps = {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  contentClassName?: string
}

export function MobileSection({
  children,
  title,
  description,
  action,
  className,
  contentClassName,
}: MobileSectionProps) {
  const hasHeader = title || description || action

  return (
    <section className={cn("space-y-3 py-3", className)}>
      {hasHeader ? (
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {title ? (
              <h2 className="text-base font-semibold leading-6 text-slate-950">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn("space-y-3", contentClassName)}>{children}</div>
    </section>
  )
}

