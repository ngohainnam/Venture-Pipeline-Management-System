"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Search,
  Building2,
  Users,
  FileText,
  DollarSign,
  FolderKanban,
  Award,
  Calendar,
  TrendingUp,
  X,
  Loader2,
  Clock,
  ChevronRight,
  Command
} from "lucide-react"

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  description?: string
  type: 'venture' | 'user' | 'document' | 'fund' | 'project' | 'gedsi' | 'capital' | 'task'
  url: string
  metadata?: {
    status?: string
    stage?: string
    amount?: number
    date?: string
  }
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

const RESULT_TYPE_CONFIG = {
  venture: {
    icon: Building2,
    label: 'Ventures',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  user: {
    icon: Users,
    label: 'Users',
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  document: {
    icon: FileText,
    label: 'Documents',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10'
  },
  fund: {
    icon: DollarSign,
    label: 'Funds',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  project: {
    icon: FolderKanban,
    label: 'Projects',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10'
  },
  gedsi: {
    icon: Award,
    label: 'GEDSI Metrics',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10'
  },
  capital: {
    icon: TrendingUp,
    label: 'Capital Activities',
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10'
  },
  task: {
    icon: Calendar,
    label: 'Tasks',
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  }
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('miv_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.results)
      } else {
        console.error('Search failed:', response.statusText)
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  const handleSelectResult = useCallback((result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('miv_recent_searches', JSON.stringify(updated))

    // Navigate to result
    router.push(result.url)
    onClose()
  }, [onClose, query, recentSearches, router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose, handleSelectResult])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, results])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('miv_recent_searches')
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 animate-in bg-foreground/45 backdrop-blur-sm duration-200 fade-in"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
        <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl animate-in duration-200 zoom-in-95">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search ventures, documents, users, funds..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg text-popover-foreground outline-none placeholder:text-muted-foreground"
            />
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            <button
              onClick={onClose}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                      <span className="text-sm text-popover-foreground">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && !isLoading && results.length === 0 && (
              <div className="p-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching for ventures, documents, or users
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div ref={resultsRef} className="py-2">
                {Object.entries(groupedResults).map(([type, items]) => {
                  const config = RESULT_TYPE_CONFIG[type as keyof typeof RESULT_TYPE_CONFIG]
                  if (!config) return null

                  return (
                    <div key={type} className="mb-4">
                      <div className="px-4 py-2 flex items-center gap-2">
                        <config.icon className={cn("h-4 w-4", config.color)} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {config.label}
                        </h3>
                        <span className="text-xs text-muted-foreground">({items.length})</span>
                      </div>
                      <div className="space-y-1 px-2">
                        {items.map((result, index) => {
                          const globalIndex = results.indexOf(result)
                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSelectResult(result)}
                              className={cn(
                                "group flex w-full items-center gap-3 rounded-md px-3 py-3 transition-colors",
                                globalIndex === selectedIndex
                                  ? "bg-accent text-accent-foreground ring-2 ring-ring/50"
                                  : "hover:bg-accent/60"
                              )}
                            >
                              <div className={cn(
                                "shrink-0 rounded-md p-2",
                                config.bgColor
                              )}>
                                <config.icon className={cn("h-4 w-4", config.color)} />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="truncate text-sm font-medium text-popover-foreground">
                                  {result.title}
                                </div>
                                {result.subtitle && (
                                  <div className="truncate text-xs text-muted-foreground">
                                    {result.subtitle}
                                  </div>
                                )}
                                {result.description && (
                                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                    {result.description}
                                  </div>
                                )}
                                {result.metadata && (
                                  <div className="flex items-center gap-2 mt-1">
                                    {result.metadata.status && (
                                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        {result.metadata.status}
                                      </span>
                                    )}
                                    {result.metadata.stage && (
                                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        {result.metadata.stage}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded bg-background px-2 py-1 font-mono text-muted-foreground">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded bg-background px-2 py-1 font-mono text-muted-foreground">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded bg-background px-2 py-1 font-mono text-muted-foreground">Esc</kbd>
                  Close
                </span>
              </div>
              {results.length > 0 && (
                <span className="text-muted-foreground">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook to control global search
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}
