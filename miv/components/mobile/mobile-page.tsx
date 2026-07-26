import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function MobilePage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-screen w-full bg-gray-50 px-4 py-6", className)}
      {...props}
    />
  )
}
