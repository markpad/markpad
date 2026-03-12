import { useState, useCallback, useMemo } from 'react'

export interface ImageConfig {
  /** The image URL */
  url: string
  /** The alt text for accessibility */
  altText: string
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
}

const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  url: '',
  altText: '',
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

  return {
    isOpen,
    open,
    close,
    imageConfig,
    setImageConfig,
    generateImageCode,
    reset,
    isValidUrl: isValidUrlValue,
  }
}
