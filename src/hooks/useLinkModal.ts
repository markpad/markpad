import { useState, useCallback, useMemo } from 'react'

export interface LinkConfig {
  /** The link URL */
  url: string
  /** The link text to display */
  text: string
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
}

const DEFAULT_LINK_CONFIG: LinkConfig = {
  url: '',
  text: '',
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

  return {
    isOpen,
    open,
    close,
    linkConfig,
    setLinkConfig,
    generateLinkCode,
    reset,
    isValidUrl: isValidUrlValue,
  }
}
