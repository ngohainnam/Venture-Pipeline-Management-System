"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', current: segments.length === 0 }
    ]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
        current: index === segments.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
          
          {item.current ? (
            <span className="font-medium text-foreground">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href || '#'}
              className="flex items-center transition-colors hover:text-foreground"
            >
              {index === 0 ? (
                <Home className="h-4 w-4" />
              ) : (
                item.label
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 

// test comment
