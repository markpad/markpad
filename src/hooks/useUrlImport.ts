import { useState, useCallback } from 'react'
import { clipFromUrl, buildClippedDocument } from '@/services/clipperService'
import type { ClipResult } from '@/services/clipperService'

export type UrlImportStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UrlImportResult {
  content: string
  title: string
  source: string
}

export interface UseUrlImportResult {
  /** Current import status */
  status: UrlImportStatus
  /** Error message, if any */
  error: string | null
  /** The imported URL result */
  result: UrlImportResult | null
  /** URL input value */
  url: string
  /** Set URL input */
  setUrl: (url: string) => void
  /** Import content from URL */
  importFromUrl: () => Promise<void>
  /** Whether the URL is valid */
  isValidUrl: boolean
  /** Reset import state */
  reset: () => void
}

function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Hook for importing content from a URL via the Web Clipper worker.
 * Handles URL validation, fetching, and content extraction.
 */
export function useUrlImport(): UseUrlImportResult {
  const [status, setStatus] = useState<UrlImportStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<UrlImportResult | null>(null)
  const [url, setUrl] = useState('')

  const isValidUrl = url.trim().length > 0 && validateUrl(url.trim())

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setResult(null)
    setUrl('')
  }, [])

  const importFromUrl = useCallback(async () => {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Please enter a URL.')
      setStatus('error')
      return
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Invalid URL. Must start with http:// or https://.')
      setStatus('error')
      return
    }

    setError(null)
    setResult(null)
    setStatus('loading')

    try {
      const clipResult: ClipResult = await clipFromUrl(trimmedUrl)
      const content = buildClippedDocument(clipResult)

      setResult({
        content,
        title: clipResult.metadata.title || 'Imported Article',
        source: trimmedUrl,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to import from URL.')
    }
  }, [url])

  return {
    status,
    error,
    result,
    url,
    setUrl,
    importFromUrl,
    isValidUrl,
    reset,
  }
}

export { validateUrl }
