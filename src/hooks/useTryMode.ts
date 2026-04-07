import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { documentRepository } from '@/lib/repositories'
import type { AppState } from '@/types'
import { themePresets } from '@/data/themes.generated'

interface UseTryModeReturn {
  /** Persists the current pako state as a new document and navigates to /editor/:id */
  saveDocument: (state: AppState) => Promise<void>
  isSaving: boolean
}

type AppStateWithThemeId = AppState & { themeId?: string }

function getThemeIdFromState(state: AppState): string | undefined {
  const explicitThemeId = (state as AppStateWithThemeId).themeId
  if (typeof explicitThemeId === 'string' && explicitThemeId.length > 0) {
    return explicitThemeId
  }

  const matchedTheme = themePresets.find((theme) => {
    const sameClasses = Object.entries(theme.tailwindClasses).every(
      ([key, value]) => state.tailwindClasses[key as keyof typeof state.tailwindClasses] === value
    )
    const sameFontFamily = theme.fontConfig.fontFamily === state.fontConfig.fontFamily
    const sameHeadingFont =
      (theme.fontConfig.headingFontFamily ?? '') === (state.fontConfig.headingFontFamily ?? '')
    return sameClasses && sameFontFamily && sameHeadingFont
  })

  return matchedTheme?.id
}

/**
 * Hook for "try" mode: manages the conversion of an ephemeral pako session into
 * a persisted document.
 *
 * Responsibilities (SRP):
 *  - Create the document in the repository
 *  - Navigate to the resulting /editor/:id route
 *  - Track in-progress state to prevent duplicate saves
 */
export function useTryMode(): UseTryModeReturn {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const isSavingRef = useRef(false)

  const saveDocument = useCallback(
    async (state: AppState) => {
      if (isSavingRef.current) return
      isSavingRef.current = true
      setIsSaving(true)
      try {
        const resolvedThemeId = getThemeIdFromState(state)
        const doc = await documentRepository.create({
          title: state.documentTitle,
          content: state.markdown,
          ...(resolvedThemeId
            ? { themeId: resolvedThemeId }
            : {
                tailwindClasses: state.tailwindClasses,
                fontConfig: state.fontConfig,
              }),
        })
        navigate(`/editor/${doc.id}`)
      } finally {
        isSavingRef.current = false
        setIsSaving(false)
      }
    },
    [navigate]
  )

  return { saveDocument, isSaving }
}
