import { renderHook, act, waitFor } from '@testing-library/react'
import { useThemesPage, SidebarFilter } from './useThemesPage'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Reference for tests
const mockCustomThemes = [
  {
    id: 'custom-1',
    name: 'My Dark Theme',
    configs: { body: { bgColor: 'bg-gray-900' }, h1: { textColor: 'text-white' } },
    basedOnPresetId: 'dracula',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'custom-2',
    name: 'Light Clean',
    configs: { body: { bgColor: 'bg-white' }, h1: { textColor: 'text-gray-900' } },
    basedOnPresetId: null,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
]

// Mock customThemeRepository - mock data must be inline due to hoisting
jest.mock('../lib/repositories', () => ({
  __esModule: true,
  customThemeRepository: {
    getAll: jest.fn(() =>
      Promise.resolve([
        {
          id: 'custom-1',
          name: 'My Dark Theme',
          configs: { body: { bgColor: 'bg-gray-900' }, h1: { textColor: 'text-white' } },
          basedOnPresetId: 'dracula',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: 'custom-2',
          name: 'Light Clean',
          configs: { body: { bgColor: 'bg-white' }, h1: { textColor: 'text-gray-900' } },
          basedOnPresetId: null,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-20'),
        },
      ])
    ),
    create: jest.fn((input: { name: string }) =>
      Promise.resolve({
        id: 'new-custom-id',
        name: input.name,
        configs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ),
    delete: jest.fn(() => Promise.resolve()),
  },
}))

// Mock useStyleSidebar - uses __mocks__/useStyleSidebar.ts
jest.mock('./useStyleSidebar')

// Reference for tests
const mockFavoriteThemes = [
  {
    id: 'github-readme',
    name: 'GitHub Readme',
    description: 'GitHub-style readme',
    category: 'serif',
    fontFamily: 'sans-serif',
    tailwindClasses: { body: 'bg-white', h1: 'text-gray-900', p: 'text-gray-700' },
    fontConfig: {},
    preview: { sampleHeading: 'Heading', sampleText: 'Text', style: 'default' },
    exampleContent: '# GitHub',
  },
]

// Mock theme-editor types
jest.mock('../components/theme-editor/types', () => ({
  __esModule: true,
  ELEMENT_SCHEMAS: {
    body: { defaults: { bgColor: 'bg-white' } },
    h1: { defaults: { textColor: 'text-gray-900' } },
    p: { defaults: { textColor: 'text-gray-700' } },
  },
  classesToConfig: jest.fn(() => ({})),
}))

// Mock urlStateService
jest.mock('../services/urlStateService', () => ({
  __esModule: true,
  encodeState: jest.fn(() => 'encoded-state'),
  defaultDocumentTitle: 'Untitled Document',
  defaultBehaviorConfig: {},
}))

describe('useThemesPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have default values', async () => {
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes.length).toBe(2)
      })

      expect(result.current.searchQuery).toBe('')
      expect(result.current.sidebarFilter).toBe('all')
      expect(result.current.categoryTab).toBe('all')
      expect(result.current.viewMode).toBe('grid')
    })

    it('should load view mode from localStorage', () => {
      localStorageMock.setItem('markpad-themes-view', 'list')
      const { result } = renderHook(() => useThemesPage())

      expect(result.current.viewMode).toBe('list')
    })

    it('should load custom themes on mount', async () => {
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes).toHaveLength(2)
        expect(result.current.customThemes[0].name).toBe('My Dark Theme')
      })
    })
  })

  describe('view mode', () => {
    it('should change view mode and persist to localStorage', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleViewModeChange('list')
      })

      expect(result.current.viewMode).toBe('list')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('markpad-themes-view', 'list')
    })
  })

  describe('search functionality', () => {
    it('should update search query', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.setSearchQuery('dark')
      })

      expect(result.current.searchQuery).toBe('dark')
    })

    it('should filter system themes by search query', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.setSearchQuery('github')
      })

      expect(
        result.current.filteredSystemThemes.some((t) => t.name.toLowerCase().includes('github'))
      ).toBe(true)
    })

    it('should filter custom themes by search query', async () => {
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes.length).toBe(2)
      })

      act(() => {
        result.current.setSearchQuery('dark')
      })

      expect(result.current.filteredCustomThemes).toHaveLength(1)
      expect(result.current.filteredCustomThemes[0].name).toBe('My Dark Theme')
    })

    it('should set headerTitle to search results when searching', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.setSearchQuery('test')
      })

      expect(result.current.headerTitle).toBe('Results for "test"')
    })
  })

  describe('sidebar filter', () => {
    it('should change sidebar filter and reset search/category', async () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.setSearchQuery('something')
        result.current.setCategoryTab('serif')
      })

      act(() => {
        result.current.handleSidebarFilterClick('starred')
      })

      expect(result.current.sidebarFilter).toBe('starred')
      expect(result.current.searchQuery).toBe('')
      expect(result.current.categoryTab).toBe('all')
    })

    it('should show only favorite themes when starred filter is active', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleSidebarFilterClick('starred')
      })

      expect(result.current.displayThemes).toEqual(mockFavoriteThemes)
    })

    it('should show empty array when my-themes filter is active (displayThemes)', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleSidebarFilterClick('my-themes')
      })

      // displayThemes returns [] for my-themes, use filteredCustomThemes instead
      expect(result.current.displayThemes).toEqual([])
    })

    it('should hide category tabs when my-themes filter is active', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleSidebarFilterClick('my-themes')
      })

      expect(result.current.showCategoryTabs).toBe(false)
    })

    it('should show category tabs for other filters', () => {
      const { result } = renderHook(() => useThemesPage())

      expect(result.current.showCategoryTabs).toBe(true)

      act(() => {
        result.current.handleSidebarFilterClick('starred')
      })

      expect(result.current.showCategoryTabs).toBe(true)
    })
  })

  describe('category tab', () => {
    it('should filter themes by category', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.setCategoryTab('serif')
      })

      expect(result.current.categoryTab).toBe('serif')
      result.current.filteredSystemThemes.forEach((theme) => {
        expect(theme.category).toBe('serif')
      })
    })

    it('should filter starred themes by category', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleSidebarFilterClick('starred')
      })

      act(() => {
        result.current.setCategoryTab('serif')
      })

      // Filtered by category - mockFavoriteThemes has category 'serif'
      expect(result.current.displayThemes).toEqual(mockFavoriteThemes)
    })
  })

  describe('sidebar items', () => {
    it('should include count for starred and my-themes', async () => {
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes.length).toBe(2)
      })

      const starredItem = result.current.sidebarItems.find((i) => i.key === 'starred')
      const myThemesItem = result.current.sidebarItems.find((i) => i.key === 'my-themes')

      expect(starredItem?.count).toBe(mockFavoriteThemes.length)
      expect(myThemesItem?.count).toBe(2)
    })
  })

  describe('header count', () => {
    it('should return custom themes count when my-themes filter is active', async () => {
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes.length).toBe(2)
      })

      act(() => {
        result.current.handleSidebarFilterClick('my-themes')
      })

      expect(result.current.headerCount).toBe(2)
    })

    it('should return display themes count for other filters', () => {
      const { result } = renderHook(() => useThemesPage())

      act(() => {
        result.current.handleSidebarFilterClick('starred')
      })

      expect(result.current.headerCount).toBe(mockFavoriteThemes.length)
    })
  })

  describe('handlers', () => {
    it('should navigate to editor with theme when applying', () => {
      const { result } = renderHook(() => useThemesPage())
      const theme = mockFavoriteThemes[0]

      act(() => {
        result.current.handleApplyTheme(theme as any)
      })

      expect(mockNavigate).toHaveBeenCalledWith('/editor#encoded-state')
    })

    it('should create custom theme and navigate to editor when editing', async () => {
      const { customThemeRepository } = require('../lib/repositories')
      const { result } = renderHook(() => useThemesPage())
      const theme = mockFavoriteThemes[0]

      await act(async () => {
        await result.current.handleEditTheme(theme as any)
      })

      expect(customThemeRepository.create).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/theme-editor/new-custom-id')
    })

    it('should delete custom theme and update state', async () => {
      const { customThemeRepository } = require('../lib/repositories')
      const { result } = renderHook(() => useThemesPage())

      await waitFor(() => {
        expect(result.current.customThemes.length).toBe(2)
      })

      await act(async () => {
        await result.current.handleDeleteCustomTheme('custom-1')
      })

      expect(customThemeRepository.delete).toHaveBeenCalledWith('custom-1')
      expect(result.current.customThemes).toHaveLength(1)
      expect(result.current.customThemes[0].id).toBe('custom-2')
    })
  })

  describe('favorites integration', () => {
    it('should expose isFavorite from useStyleSidebar', () => {
      const { result } = renderHook(() => useThemesPage())

      expect(result.current.isFavorite('github-readme')).toBe(true)
      expect(result.current.isFavorite('other-theme')).toBe(false)
    })

    it('should expose favoriteThemes from useStyleSidebar', () => {
      const { result } = renderHook(() => useThemesPage())

      expect(result.current.favoriteThemes).toEqual(mockFavoriteThemes)
    })
  })
})
