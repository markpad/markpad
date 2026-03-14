import { useState, useCallback, useMemo, useEffect } from 'react'

export interface ImageConfig {
  /** The image URL */
  url: string
  /** The alt text for accessibility */
  altText: string
}

export interface ImageHistoryItem {
  url: string
  altText: string
  timestamp: number
}

export interface UseImageModalResult {
  /** Whether the modal is open */
  isOpen: boolean
  /** Open the modal */
  open: () => void
  /** Close the modal */
  close: () => void
  /** Current image configuration */
  imageConfig: ImageConfig
  /** Update image configuration */
  setImageConfig: (config: Partial<ImageConfig>) => void
  /** Generate the markdown code to insert */
  generateImageCode: () => string
  /** Reset modal state */
  reset: () => void
  /** Whether the URL is valid for preview */
  isValidUrl: boolean
  /** History of recently added images */
  history: ImageHistoryItem[]
  /** Add current image to history */
  addToHistory: (url?: string, altText?: string) => void
  /** Remove item from history */
  removeFromHistory: (timestamp: number) => void
  /** Load image from history */
  loadFromHistory: (item: ImageHistoryItem) => void
  /** Search query for filtering history */
  searchQuery: string
  /** Update search query */
  setSearchQuery: (query: string) => void
  /** Filtered history based on search */
  filteredHistory: ImageHistoryItem[]
}

const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  url: '',
  altText: '',
}

const IMAGE_HISTORY_KEY = 'taildown_image_history'
const MAX_HISTORY_ITEMS = 20

/**
 * Load image history from localStorage
 */
function loadImageHistory(): ImageHistoryItem[] {
  try {
    const stored = localStorage.getItem(IMAGE_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save image history to localStorage
 */
function saveImageHistory(history: ImageHistoryItem[]): void {
  try {
    localStorage.setItem(IMAGE_HISTORY_KEY, JSON.stringify(history))
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
 * Hook to manage the Image Insert Modal state and logic
 */
export function useImageModal(): UseImageModalResult {
  const [isOpen, setIsOpen] = useState(false)
  const [imageConfig, setImageConfigState] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG)
  const [history, setHistory] = useState<ImageHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load history on mount
  useEffect(() => {
    setHistory(loadImageHistory())
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const reset = useCallback(() => {
    setImageConfigState(DEFAULT_IMAGE_CONFIG)
  }, [])

  const setImageConfig = useCallback((config: Partial<ImageConfig>) => {
    setImageConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  // Generate the markdown image code
  const generateImageCode = useCallback(() => {
    const { url, altText } = imageConfig
    if (!url) return ''
    return `![${altText}](${url})`
  }, [imageConfig])

  // Check if URL is valid for preview
  const isValidUrlValue = useMemo(() => {
    return isValidUrl(imageConfig.url)
  }, [imageConfig.url])

  // Add to history
  const addToHistory = useCallback(
    (urlParam?: string, altTextParam?: string) => {
      const url = urlParam ?? imageConfig.url
      const altText = altTextParam ?? imageConfig.altText
      if (!url) return

      const newItem: ImageHistoryItem = {
        url,
        altText,
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
        saveImageHistory(limited)
        return limited
      })
    },
    [imageConfig]
  )

  // Remove from history
  const removeFromHistory = useCallback((timestamp: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.timestamp !== timestamp)
      saveImageHistory(updated)
      return updated
    })
  }, [])

  // Load from history
  const loadFromHistory = useCallback((item: ImageHistoryItem) => {
    setImageConfigState({
      url: item.url,
      altText: item.altText,
    })
  }, [])

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      (item) => item.url.toLowerCase().includes(query) || item.altText.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  return {
    isOpen,
    open,
    close,
    imageConfig,
    setImageConfig,
    generateImageCode,
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
