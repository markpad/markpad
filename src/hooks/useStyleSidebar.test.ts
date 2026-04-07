import { renderHook, act } from '@testing-library/react'
import { useStyleSidebar } from '@/hooks/useStyleSidebar'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useStyleSidebar', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.resetAllMocks()
  })

  describe('search functionality', () => {
    it('should default to empty search query', () => {
      const { result } = renderHook(() => useStyleSidebar())
      expect(result.current.searchQuery).toBe('')
    })

    it('should update search query', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.setSearchQuery('dark')
      })

      expect(result.current.searchQuery).toBe('dark')
    })

    it('should filter themes by search query', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.setSearchQuery('github')
      })

      expect(
        result.current.filteredThemes.some((t) => t.name.toLowerCase().includes('github'))
      ).toBe(true)
    })
  })

  describe('favorites', () => {
    it('should start with no favorites', () => {
      const { result } = renderHook(() => useStyleSidebar())
      expect(result.current.favoriteThemeIds).toEqual([])
      expect(result.current.favoriteThemes).toEqual([])
    })

    it('should add theme to favorites', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.toggleFavorite('github-readme')
      })

      expect(result.current.favoriteThemeIds).toContain('github-readme')
      expect(result.current.isFavorite('github-readme')).toBe(true)
    })

    it('should remove theme from favorites when toggled again', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.toggleFavorite('github-readme')
      })

      expect(result.current.isFavorite('github-readme')).toBe(true)

      act(() => {
        result.current.toggleFavorite('github-readme')
      })

      expect(result.current.isFavorite('github-readme')).toBe(false)
      expect(result.current.favoriteThemeIds).not.toContain('github-readme')
    })

    it('should persist favorites to localStorage', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.toggleFavorite('dracula')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'markpad-favorite-themes',
        expect.stringContaining('dracula')
      )
    })

    it('should load favorites from localStorage on mount', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markpad-favorite-themes') {
          return JSON.stringify(['nord', 'dracula'])
        }
        return null
      })

      const { result } = renderHook(() => useStyleSidebar())

      expect(result.current.favoriteThemeIds).toContain('nord')
      expect(result.current.favoriteThemeIds).toContain('dracula')
    })

    it('should return favorite themes', () => {
      const { result } = renderHook(() => useStyleSidebar())

      act(() => {
        result.current.toggleFavorite('academic-paper')
      })

      act(() => {
        result.current.toggleFavorite('dracula')
      })

      expect(result.current.favoriteThemes.length).toBe(2)
      expect(result.current.favoriteThemes.some((t) => t.id === 'academic-paper')).toBe(true)
      expect(result.current.favoriteThemes.some((t) => t.id === 'dracula')).toBe(true)
    })
  })

  describe('local themes', () => {
    it('should save a local theme', () => {
      const { result } = renderHook(() => useStyleSidebar())

      const mockConfig = {
        tailwindClasses: {} as any,
        behaviorConfig: {} as any,
        fontConfig: {} as any,
        fontFamily: 'Inter',
      }

      act(() => {
        result.current.saveAsLocalTheme('My Theme', mockConfig)
      })

      expect(result.current.localThemes.length).toBe(1)
      expect(result.current.localThemes[0].name).toBe('My Theme')
      expect(result.current.localThemes[0].isLocal).toBe(true)
    })

    it('should delete a local theme', () => {
      const { result } = renderHook(() => useStyleSidebar())

      const mockConfig = {
        tailwindClasses: {} as any,
        behaviorConfig: {} as any,
        fontConfig: {} as any,
        fontFamily: 'Inter',
      }

      let themeId: string
      act(() => {
        const theme = result.current.saveAsLocalTheme('My Theme', mockConfig)
        themeId = theme.id
      })

      expect(result.current.localThemes.length).toBe(1)

      act(() => {
        result.current.deleteLocalTheme(themeId!)
      })

      expect(result.current.localThemes.length).toBe(0)
    })
  })
})
