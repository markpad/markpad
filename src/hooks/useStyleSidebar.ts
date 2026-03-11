import { useState, useCallback, useMemo, useEffect } from 'react'
import { themePresets, ThemePreset, ThemePreview } from '../data/themes.generated'

export type SidebarTab = 'themes' | 'advanced'

interface LocalTheme extends ThemePreset {
  isLocal: true
  createdAt: number
}

const LOCAL_THEMES_KEY = 'marklab-local-themes'

export function useStyleSidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('themes')
  const [searchQuery, setSearchQuery] = useState('')
  const [localThemes, setLocalThemes] = useState<LocalTheme[]>([])

  // Load local themes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_THEMES_KEY)
      if (stored) {
        setLocalThemes(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load local themes:', e)
    }
  }, [])

  // Save local themes to localStorage
  const saveLocalThemesToStorage = useCallback((themes: LocalTheme[]) => {
    try {
      localStorage.setItem(LOCAL_THEMES_KEY, JSON.stringify(themes))
    } catch (e) {
      console.error('Failed to save local themes:', e)
    }
  }, [])

  // Save current customization as a local theme
  const saveAsLocalTheme = useCallback(
    (
      name: string,
      currentConfig: Pick<
        ThemePreset,
        'tailwindClasses' | 'behaviorConfig' | 'fontConfig' | 'fontFamily'
      >
    ) => {
      const defaultPreview: ThemePreview = {
        bgColor: '#ffffff',
        textColor: '#374151',
        accentColor: '#3b82f6',
        headingFont: currentConfig.fontFamily,
        bodyFont: currentConfig.fontFamily,
        sampleHeading: 'Custom Theme',
        sampleText: 'Your saved styles',
        style: 'default',
      }

      const newTheme: LocalTheme = {
        id: `local-${Date.now()}`,
        name,
        description: 'Custom saved theme',
        category: 'experimental',
        fontFamily: currentConfig.fontFamily,
        tailwindClasses: currentConfig.tailwindClasses,
        behaviorConfig: currentConfig.behaviorConfig,
        fontConfig: currentConfig.fontConfig,
        preview: defaultPreview,
        exampleContent: '',
        isLocal: true,
        createdAt: Date.now(),
      }

      const updatedThemes = [...localThemes, newTheme]
      setLocalThemes(updatedThemes)
      saveLocalThemesToStorage(updatedThemes)
      return newTheme
    },
    [localThemes, saveLocalThemesToStorage]
  )

  // Delete a local theme
  const deleteLocalTheme = useCallback(
    (themeId: string) => {
      const updatedThemes = localThemes.filter((t) => t.id !== themeId)
      setLocalThemes(updatedThemes)
      saveLocalThemesToStorage(updatedThemes)
    },
    [localThemes, saveLocalThemesToStorage]
  )

  // Filter themes based on search query
  const filteredThemes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) {
      return [...localThemes, ...themePresets]
    }

    const filterFn = (theme: ThemePreset | LocalTheme) =>
      theme.name.toLowerCase().includes(query) ||
      theme.description.toLowerCase().includes(query) ||
      theme.category.toLowerCase().includes(query)

    return [...localThemes.filter(filterFn), ...themePresets.filter(filterFn)]
  }, [searchQuery, localThemes])

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    localThemes,
    filteredThemes,
    saveAsLocalTheme,
    deleteLocalTheme,
  }
}
