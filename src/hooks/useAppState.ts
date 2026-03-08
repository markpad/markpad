import { useState, useEffect, useCallback, useRef } from 'react'
import type { AppState, TailwindClasses, BehaviorConfig, FontConfig } from '../types'
import {
  getStateFromUrl,
  updateUrlWithState,
  defaultTailwindClasses,
  defaultBehaviorConfig,
  defaultFontConfig,
} from '../services/urlStateService'
import debounce from '../utils/debounce'
import initialMarkdown from '../initialMarkdown'

interface UseAppStateReturn {
  state: AppState
  setMarkdown: (markdown: string) => void
  setTailwindClasses: (tailwindClasses: TailwindClasses) => void
  updateTailwindClass: (element: keyof TailwindClasses, value: string) => void
  setBehaviorConfig: (behaviorConfig: BehaviorConfig) => void
  updateBehaviorConfig: <K extends keyof BehaviorConfig>(key: K, value: BehaviorConfig[K]) => void
  setFontConfig: (fontConfig: FontConfig) => void
  updateFontConfig: <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => void
  resetToDefaults: () => void
}

/**
 * Custom hook for managing application state with URL persistence
 * Follows Single Responsibility Principle - handles only state management
 */
export function useAppState(): UseAppStateReturn {
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from URL or defaults
  const getInitialState = (): AppState => {
    const urlState = getStateFromUrl()
    if (urlState !== null) {
      return urlState
    }

    // Check localStorage for backwards compatibility
    const savedMarkdown = localStorage.getItem('markdown')

    return {
      markdown: savedMarkdown ?? initialMarkdown,
      tailwindClasses: defaultTailwindClasses,
      behaviorConfig: defaultBehaviorConfig,
      fontConfig: defaultFontConfig,
    }
  }

  const [state, setState] = useState<AppState>(getInitialState)

  // Debounced URL update to prevent too many history changes
  const debouncedUpdateUrl = useRef(
    debounce((newState: AppState) => {
      updateUrlWithState(newState)
    }, 1000)
  ).current

  // Update URL when state changes
  useEffect(() => {
    if (isInitialized) {
      debouncedUpdateUrl(state)
      // Also save to localStorage for backwards compatibility
      localStorage.setItem('markdown', state.markdown)
    }
  }, [state, isInitialized, debouncedUpdateUrl])

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const setMarkdown = useCallback((markdown: string) => {
    setState((prev) => ({ ...prev, markdown }))
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

  const setBehaviorConfig = useCallback((behaviorConfig: BehaviorConfig) => {
    setState((prev) => ({ ...prev, behaviorConfig }))
  }, [])

  const updateBehaviorConfig = useCallback(
    <K extends keyof BehaviorConfig>(key: K, value: BehaviorConfig[K]) => {
      setState((prev) => ({
        ...prev,
        behaviorConfig: {
          ...prev.behaviorConfig,
          [key]: value,
        },
      }))
    },
    []
  )

  const resetToDefaults = useCallback(() => {
    setState({
      markdown: initialMarkdown,
      tailwindClasses: defaultTailwindClasses,
      behaviorConfig: defaultBehaviorConfig,
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

  return {
    state,
    setMarkdown,
    setTailwindClasses,
    updateTailwindClass,
    setBehaviorConfig,
    updateBehaviorConfig,
    setFontConfig,
    updateFontConfig,
    resetToDefaults,
  }
}
