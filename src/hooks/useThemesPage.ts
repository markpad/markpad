import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  themePresets,
  filterThemesByCategory,
  searchThemes,
  THEME_CATEGORIES,
} from '@/data/themes.generated'
import type { ThemePreset, ThemeCategory } from '@/data/themes.generated'
import type { MarkpadCustomTheme } from '@/lib/repositories/types'
import { useStyleSidebar } from '@/hooks/useStyleSidebar'
import { encodeState, defaultDocumentTitle } from '@/services/urlStateService'
import { customThemeRepository } from '@/lib/repositories'
import { ELEMENT_SCHEMAS, classesToConfig } from '@/components/theme-editor/types'
import type { ThemeElement } from '@/components/theme-editor/types'

export type SidebarFilter = 'all' | 'system' | 'starred' | 'my-themes'

const VIEW_MODE_STORAGE_KEY = 'markpad-themes-view'

export interface SidebarItem {
  key: SidebarFilter
  label: string
  count?: number
}

export interface UseThemesPageReturn {
  // State
  searchQuery: string
  sidebarFilter: SidebarFilter
  categoryTab: ThemeCategory
  viewMode: 'grid' | 'list'
  customThemes: MarkpadCustomTheme[]

  // Computed
  filteredSystemThemes: ThemePreset[]
  displayThemes: ThemePreset[]
  filteredCustomThemes: MarkpadCustomTheme[]
  showCategoryTabs: boolean
  headerCount: number
  headerTitle: string
  sidebarItems: SidebarItem[]
  categoryTabs: { value: ThemeCategory; label: string }[]

  // Favorites (from useStyleSidebar)
  favoriteThemes: ThemePreset[]
  isFavorite: (themeId: string) => boolean
  toggleFavorite: (themeId: string) => void

  // Setters
  setSearchQuery: (query: string) => void
  setCategoryTab: (tab: ThemeCategory) => void

  // Handlers
  handleViewModeChange: (mode: 'grid' | 'list') => void
  handleSidebarFilterClick: (filter: SidebarFilter) => void
  handleApplyTheme: (theme: ThemePreset) => void
  handleEditTheme: (theme: ThemePreset) => Promise<void>
  handleDeleteCustomTheme: (id: string) => Promise<void>
  loadCustomThemes: () => Promise<void>
}

export function useThemesPage(): UseThemesPageReturn {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>('all')
  const [categoryTab, setCategoryTab] = useState<ThemeCategory>('all')
  const styleSidebar = useStyleSidebar()
  // Provide defaults in case hook returns undefined values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const favoriteThemes = useMemo(
    () => styleSidebar?.favoriteThemes ?? [],
    [styleSidebar?.favoriteThemes]
  )
  const toggleFavorite = styleSidebar?.toggleFavorite ?? (() => {})
  const isFavorite = styleSidebar?.isFavorite ?? (() => false)

  // Custom themes from IndexedDB
  const [customThemes, setCustomThemes] = useState<MarkpadCustomTheme[]>([])

  const loadCustomThemes = useCallback(async () => {
    const themes = await customThemeRepository.getAll()
    setCustomThemes(themes)
  }, [])

  useEffect(() => {
    loadCustomThemes()
  }, [loadCustomThemes])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list') || 'grid'
  })

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  // System themes filtered by search + category tab
  const filteredSystemThemes = useMemo(() => {
    let themes: ThemePreset[]
    if (searchQuery.trim()) {
      themes = searchThemes(searchQuery)
    } else if (categoryTab === 'all') {
      themes = themePresets
    } else {
      themes = filterThemesByCategory(categoryTab)
    }
    return themes
  }, [searchQuery, categoryTab])

  // Decide which themes to show based on sidebar filter
  const displayThemes = useMemo(() => {
    if (sidebarFilter === 'starred') {
      if (categoryTab === 'all') return favoriteThemes
      return favoriteThemes.filter((t) => t.category === categoryTab)
    }
    if (sidebarFilter === 'system' || sidebarFilter === 'all') {
      return filteredSystemThemes
    }
    return []
  }, [sidebarFilter, filteredSystemThemes, favoriteThemes, categoryTab])

  const handleApplyTheme = useCallback(
    (theme: ThemePreset) => {
      const state = {
        markdown: theme.exampleContent,
        documentTitle: defaultDocumentTitle,
        tailwindClasses: theme.tailwindClasses,
        fontConfig: theme.fontConfig,
      }
      const encoded = encodeState(state)
      navigate(`/new#${encoded}`)
    },
    [navigate]
  )

  const handleEditTheme = useCallback(
    async (theme: ThemePreset) => {
      // Convert preset tailwindClasses into per-element configs
      const configs: Record<string, Record<string, string | undefined>> = {}
      for (const [element, schema] of Object.entries(ELEMENT_SCHEMAS)) {
        configs[element] = { ...schema.defaults } as Record<string, string | undefined>
      }
      if (theme.tailwindClasses) {
        for (const [element, classString] of Object.entries(theme.tailwindClasses)) {
          if (element in configs) {
            configs[element] = {
              ...classesToConfig(classString as string, element as ThemeElement),
            } as Record<string, string | undefined>
          }
        }
      }
      // Create new custom theme in IndexedDB and navigate to it
      const created = await customThemeRepository.create({
        name: theme.name,
        configs,
        basedOnPresetId: theme.id,
      })
      navigate(`/theme-editor/${created.id}`)
    },
    [navigate]
  )

  const handleDeleteCustomTheme = useCallback(async (id: string) => {
    await customThemeRepository.delete(id)
    setCustomThemes((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showCategoryTabs = sidebarFilter !== 'my-themes'

  // Filtered custom themes by search
  const filteredCustomThemes = useMemo(() => {
    if (!searchQuery.trim()) return customThemes
    const q = searchQuery.toLowerCase()
    return customThemes.filter((t) => t.name.toLowerCase().includes(q))
  }, [customThemes, searchQuery])

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { key: 'all', label: 'All Themes' },
      { key: 'system', label: 'System' },
      { key: 'starred', label: 'Starred', count: favoriteThemes.length },
      { key: 'my-themes', label: 'My Themes', count: customThemes.length },
    ],
    [favoriteThemes.length, customThemes.length]
  )

  const categoryTabs = useMemo(() => THEME_CATEGORIES.filter((c) => c.value !== 'all'), [])

  const headerCount =
    sidebarFilter === 'my-themes' ? filteredCustomThemes.length : displayThemes.length

  const headerTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : sidebarItems.find((s) => s.key === sidebarFilter)?.label || 'Themes'

  const handleSidebarFilterClick = useCallback(
    (filter: SidebarFilter) => {
      setSidebarFilter(filter)
      setSearchQuery('')
      setCategoryTab('all')
      if (filter === 'my-themes') {
        loadCustomThemes()
      }
    },
    [loadCustomThemes]
  )

  return {
    // State
    searchQuery,
    sidebarFilter,
    categoryTab,
    viewMode,
    customThemes,

    // Computed
    filteredSystemThemes,
    displayThemes,
    filteredCustomThemes,
    showCategoryTabs,
    headerCount,
    headerTitle,
    sidebarItems,
    categoryTabs,

    // Favorites
    favoriteThemes,
    isFavorite,
    toggleFavorite,

    // Setters
    setSearchQuery,
    setCategoryTab,

    // Handlers
    handleViewModeChange,
    handleSidebarFilterClick,
    handleApplyTheme,
    handleEditTheme,
    handleDeleteCustomTheme,
    loadCustomThemes,
  }
}
