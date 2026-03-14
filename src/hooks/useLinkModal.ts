import { useState, useCallback, useMemo, useEffect } from 'react'

export interface LinkConfig {
  /** The link URL */
  url: string
  /** The link text to display */
  text: string
}

export interface LinkHistoryItem {
  url: string
  text: string
  timestamp: number
}

export interface UseLinkModalResult {
  /** Whether the modal is open */
  isOpen: boolean
  /** Open the modal */
  open: () => void
  /** Close the modal */
  close: () => void
  /** Current link configuration */
  linkConfig: LinkConfig
  /** Update link configuration */
  setLinkConfig: (config: Partial<LinkConfig>) => void
  /** Generate the markdown code to insert */
  generateLinkCode: () => string
  /** Reset modal state */
  reset: () => void
  /** Whether the URL is valid */
  isValidUrl: boolean
  /** History of recently added links */
  history: LinkHistoryItem[]
  /** Add current link to history */
  addToHistory: (url?: string, text?: string) => void
  /** Remove item from history */
  removeFromHistory: (timestamp: number) => void
  /** Load link from history */
  loadFromHistory: (item: LinkHistoryItem) => void
  /** Search query for filtering history */
  searchQuery: string
  /** Update search query */
  setSearchQuery: (query: string) => void
  /** Filtered history based on search */
  filteredHistory: LinkHistoryItem[]
}

const DEFAULT_LINK_CONFIG: LinkConfig = {
  url: '',
  text: '',
}

const LINK_HISTORY_KEY = 'taildown_link_history'
const MAX_HISTORY_ITEMS = 20

/**
 * Load link history from localStorage
 */
function loadLinkHistory(): LinkHistoryItem[] {
  try {
    const stored = localStorage.getItem(LINK_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save link history to localStorage
 */
function saveLinkHistory(history: LinkHistoryItem[]): void {
  try {
    localStorage.setItem(LINK_HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Silence localStorage errors
  }
}

/**
 * Validate if a string is a valid URL
 */
function isValidUrl(urlString: string): boolean {
  if (!urlString || urlString.trim().length === 0) return false

  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

/**
 * Hook to manage the Link Insert Modal state and logic
 */
export function useLinkModal(): UseLinkModalResult {
  const [isOpen, setIsOpen] = useState(false)
  const [linkConfig, setLinkConfigState] = useState<LinkConfig>(DEFAULT_LINK_CONFIG)
  const [history, setHistory] = useState<LinkHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load history on mount
  useEffect(() => {
    setHistory(loadLinkHistory())
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const reset = useCallback(() => {
    setLinkConfigState(DEFAULT_LINK_CONFIG)
  }, [])

  const setLinkConfig = useCallback((config: Partial<LinkConfig>) => {
    setLinkConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  // Generate the markdown link code
  const generateLinkCode = useCallback(() => {
    const { url, text } = linkConfig
    if (!url || url.trim().length === 0) return ''
    const displayText = text || url
    return `[${displayText}](${url})`
  }, [linkConfig])

  // Check if URL is valid
  const isValidUrlValue = useMemo(() => {
    return isValidUrl(linkConfig.url)
  }, [linkConfig.url])

  // Add to history
  const addToHistory = useCallback(
    (urlParam?: string, textParam?: string) => {
      const url = urlParam ?? linkConfig.url
      const text = textParam ?? linkConfig.text
      if (!url || url.trim().length === 0) return

      const newItem: LinkHistoryItem = {
        url,
        text,
        timestamp: Date.now(),
      }

      setHistory((prev) => {
        // Remove duplicates (same URL)
        const filtered = prev.filter((item) => item.url !== url)
        // Add new item at the beginning
        const updated = [newItem, ...filtered]
        // Keep only MAX_HISTORY_ITEMS
        const limited = updated.slice(0, MAX_HISTORY_ITEMS)
        // Save to localStorage
        saveLinkHistory(limited)
        return limited
      })
    },
    [linkConfig]
  )

  // Remove from history
  const removeFromHistory = useCallback((timestamp: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.timestamp !== timestamp)
      saveLinkHistory(updated)
      return updated
    })
  }, [])

  // Load from history
  const loadFromHistory = useCallback((item: LinkHistoryItem) => {
    setLinkConfigState({
      url: item.url,
      text: item.text,
    })
  }, [])

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      (item) => item.url.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  return {
    isOpen,
    open,
    close,
    linkConfig,
    setLinkConfig,
    generateLinkCode,
    reset,
    isValidUrl: isValidUrlValue,
    history,
    addToHistory,
    removeFromHistory,
    loadFromHistory,
    searchQuery,
    setSearchQuery,
    filteredHistory,
  }
}
