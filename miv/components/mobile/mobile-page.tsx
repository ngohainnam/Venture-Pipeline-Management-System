import * as React from "react"

import { cn } from "@/lib/utils"

type MobilePageProps = {
  children: React.ReactNode
  className?: string
}

export function MobilePage({ children, className }: MobilePageProps) {
  return (
    <main
      className={cn(
        "mx-auto min-h-dvh w-full max-w-md px-4 pb-28 pt-4 sm:max-w-lg sm:px-6 md:max-w-2xl lg:max-w-none lg:px-0 lg:pb-0",
        className
      )}
    >
      {children}
    </main>
  )
}

