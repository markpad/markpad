import { useState, useEffect, useCallback, useRef } from 'react'
import type { AppState, TailwindClasses, FontConfig } from '../types'
import {
  getStateFromUrl,
  updateUrlWithState,
  defaultTailwindClasses,
  defaultFontConfig,
  defaultDocumentTitle,
} from '../services/urlStateService'
import debounce from '../utils/debounce'
import initialMarkdown from '../initialMarkdown'

interface UseAppStateOptions {
  /** When set, disables pako URL persistence (state is persisted to IndexedDB instead) */
  docId?: string | null
}

interface UseAppStateReturn {
  state: AppState
  setMarkdown: (markdown: string) => void
  setDocumentTitle: (title: string) => void
  setTailwindClasses: (tailwindClasses: TailwindClasses) => void
  updateTailwindClass: (element: keyof TailwindClasses, value: string) => void
  setFontConfig: (fontConfig: FontConfig) => void
  updateFontConfig: <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => void
  resetToDefaults: () => void
  /** Replace entire state at once (used when loading a document from IndexedDB) */
  loadState: (newState: AppState) => void
}

/**
 * Custom hook for managing application state
 * When docId is provided, URL pako persistence is disabled (document mode).
 * When no docId, falls back to URL hash persistence via pako (anonymous/legacy mode).
 */
export function useAppState(options?: UseAppStateOptions): UseAppStateReturn {
  const docId = options?.docId
  const isDocumentMode = !!docId

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from URL (if no docId) or defaults (if docId - will be overwritten by Editor)
  const getInitialState = (): AppState => {
    // In document mode, start with defaults; Editor will load full state from IndexedDB
    if (isDocumentMode) {
      return {
        markdown: '',
        documentTitle: defaultDocumentTitle,
        tailwindClasses: defaultTailwindClasses,
        fontConfig: defaultFontConfig,
      }
    }

    const urlState = getStateFromUrl()
    if (urlState !== null) {
      return urlState
    }

    // Check if this is a new document request
    const urlParams = new URLSearchParams(window.location.search)
    const isNewDocument = urlParams.get('new') === 'true'

    // Check localStorage for backwards compatibility (unless new document)
    const savedMarkdown = !isNewDocument ? localStorage.getItem('markdown') : null

    return {
      markdown: savedMarkdown ?? initialMarkdown,
      documentTitle: defaultDocumentTitle,
      tailwindClasses: defaultTailwindClasses,
      fontConfig: defaultFontConfig,
    }
  }

  const [state, setState] = useState<AppState>(getInitialState)

  // Debounced URL update (only used in anonymous mode)
  const debouncedUpdateUrl = useRef(
    debounce((newState: AppState) => {
      updateUrlWithState(newState)
    }, 1000)
  ).current

  // Update URL when state changes (only in anonymous mode)
  useEffect(() => {
    if (isInitialized && !isDocumentMode) {
      debouncedUpdateUrl(state)
      // Also save to localStorage for backwards compatibility
      localStorage.setItem('markdown', state.markdown)
    }
  }, [state, isInitialized, isDocumentMode, debouncedUpdateUrl])

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const setMarkdown = useCallback((markdown: string) => {
    setState((prev) => ({ ...prev, markdown }))
  }, [])

  const setDocumentTitle = useCallback((documentTitle: string) => {
    setState((prev) => ({ ...prev, documentTitle }))
  }, [])

  const setTailwindClasses = useCallback((tailwindClasses: TailwindClasses) => {
    setState((prev) => ({ ...prev, tailwindClasses }))
  }, [])

  const updateTailwindClass = useCallback((element: keyof TailwindClasses, value: string) => {
    setState((prev) => ({
      ...prev,
      tailwindClasses: {
        ...prev.tailwindClasses,
        [element]: value,
      },
    }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setState({
      markdown: initialMarkdown,
      documentTitle: defaultDocumentTitle,
      tailwindClasses: defaultTailwindClasses,
      fontConfig: defaultFontConfig,
    })
  }, [])

  const setFontConfig = useCallback((fontConfig: FontConfig) => {
    setState((prev) => ({ ...prev, fontConfig }))
  }, [])

  const updateFontConfig = useCallback(
    <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => {
      setState((prev) => ({
        ...prev,
        fontConfig: {
          ...prev.fontConfig,
          [key]: value,
        },
      }))
    },
    []
  )

  const loadState = useCallback((newState: AppState) => {
    setState(newState)
  }, [])

  return {
    state,
    setMarkdown,
    setDocumentTitle,
    setTailwindClasses,
    updateTailwindClass,
    setFontConfig,
    updateFontConfig,
    resetToDefaults,
    loadState,
  }
}
