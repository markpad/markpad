import { renderHook, act, waitFor } from '@testing-library/react'
import { useTemplatesPage } from '@/hooks/useTemplatesPage'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock localStorage — plain functions survive CRA's resetMocks: true
const localStorageStore: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: jest.fn((key: string, value: string) => {
    localStorageStore[key] = value
  }),
  removeItem: (key: string) => {
    delete localStorageStore[key]
  },
  clear: () => {
    Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key])
  },
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Reference data for tests
const mockTemplates = [
  {
    id: 'template-1',
    title: 'Blog Post',
    description: 'A blog post template',
    content: '# Blog Title\n\nContent here...',
    isSystem: true,
    version: 1,
    themeId: null,
    category: 'writing',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'template-2',
    title: 'My Custom Template',
    description: 'Custom template',
    content: '# Custom\n\nYour content...',
    isSystem: false,
    version: 1,
    themeId: 'theme-1',
    category: null,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
]

// Mock functions for assertions (implementations set in beforeEach)
const mockRefresh = jest.fn()
const mockSetFilter = jest.fn()
const mockSetSearchQuery = jest.fn()
const mockSeedSystemTemplates = jest.fn()
const mockDocCreate = jest.fn()

// Mock useTemplates — use plain function to survive resetMocks
jest.mock('./useTemplates', () => ({
  __esModule: true,
  useTemplates: () => ({
    templates: mockTemplates,
    loading: false,
    error: null,
    filter: 'all',
    searchQuery: '',
    setFilter: mockSetFilter,
    setSearchQuery: mockSetSearchQuery,
    refresh: mockRefresh,
  }),
}))

// Mock seedService — delegate to jest.fn ref
jest.mock('../services/seedService', () => ({
  __esModule: true,
  seedSystemTemplates: (...args: any[]) => mockSeedSystemTemplates(...args),
}))

// Mock documentRepository — delegate to jest.fn ref
jest.mock('../lib/repositories', () => ({
  __esModule: true,
  documentRepository: {
    create: (...args: any[]) => mockDocCreate(...args),
  },
}))

describe('useTemplatesPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()

    // Re-set spy implementations (cleared by CRA's resetMocks: true)
    ;(localStorageMock.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
      localStorageStore[key] = value
    })

    mockRefresh.mockImplementation(() => Promise.resolve())
    mockSetFilter.mockImplementation(() => {})
    mockSetSearchQuery.mockImplementation(() => {})
    mockSeedSystemTemplates.mockImplementation(() => Promise.resolve())
    mockDocCreate.mockImplementation((input: any) =>
      Promise.resolve({
        id: 'new-doc-id',
        title: input.title,
        content: input.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        starred: false,
        trashedAt: null,
      })
    )
  })

  describe('initial state', () => {
    it('should have default view mode as grid', () => {
      const { result } = renderHook(() => useTemplatesPage())

      expect(result.current.viewMode).toBe('grid')
    })

    it('should load view mode from localStorage', () => {
      localStorageMock.setItem('markpad-templates-view', 'list')
      const { result } = renderHook(() => useTemplatesPage())

      expect(result.current.viewMode).toBe('list')
    })

    it('should expose templates from useTemplates', () => {
      const { result } = renderHook(() => useTemplatesPage())

      expect(result.current.templates).toHaveLength(2)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should seed system templates on mount', async () => {
      renderHook(() => useTemplatesPage())

      await waitFor(() => {
        expect(mockSeedSystemTemplates).toHaveBeenCalled()
      })
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  describe('view mode', () => {
    it('should change view mode and persist to localStorage', () => {
      const { result } = renderHook(() => useTemplatesPage())

      act(() => {
        result.current.handleViewModeChange('list')
      })

      expect(result.current.viewMode).toBe('list')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('markpad-templates-view', 'list')
    })

    it('should change back to grid', () => {
      localStorageMock.setItem('markpad-templates-view', 'list')
      const { result } = renderHook(() => useTemplatesPage())

      expect(result.current.viewMode).toBe('list')

      act(() => {
        result.current.handleViewModeChange('grid')
      })

      expect(result.current.viewMode).toBe('grid')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('markpad-templates-view', 'grid')
    })
  })

  describe('handleUseTemplate', () => {
    it('should create a document from template and navigate to editor', async () => {
      const { result } = renderHook(() => useTemplatesPage())
      const template = mockTemplates[0]

      await act(async () => {
        await result.current.handleUseTemplate(template as any)
      })

      expect(mockDocCreate).toHaveBeenCalledWith({
        title: 'Blog Post — New',
        content: '# Blog Title\n\nContent here...',
        themeId: null,
        variables: {},
        templateId: 'template-1',
        templateVersion: 1,
      })
      expect(mockNavigate).toHaveBeenCalledWith('/editor/new-doc-id')
    })

    it('should include themeId if template has one', async () => {
      const { result } = renderHook(() => useTemplatesPage())
      const template = mockTemplates[1]

      await act(async () => {
        await result.current.handleUseTemplate(template as any)
      })

      expect(mockDocCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          themeId: 'theme-1',
        })
      )
    })
  })

  describe('handleEditTemplate', () => {
    it('should navigate to template editor with template id', () => {
      const { result } = renderHook(() => useTemplatesPage())
      const template = mockTemplates[0]

      act(() => {
        result.current.handleEditTemplate(template as any)
      })

      expect(mockNavigate).toHaveBeenCalledWith('/template/template-1')
    })
  })

  describe('handleNewTemplate', () => {
    it('should navigate to new template page', () => {
      const { result } = renderHook(() => useTemplatesPage())

      act(() => {
        result.current.handleNewTemplate()
      })

      expect(mockNavigate).toHaveBeenCalledWith('/template/new')
    })
  })

  describe('passthrough from useTemplates', () => {
    it('should expose filter-related functions', () => {
      const { result } = renderHook(() => useTemplatesPage())

      expect(result.current.filter).toBe('all')
      expect(result.current.searchQuery).toBe('')
      expect(typeof result.current.setFilter).toBe('function')
      expect(typeof result.current.setSearchQuery).toBe('function')
    })

    it('should call setFilter from useTemplates', () => {
      const { result } = renderHook(() => useTemplatesPage())

      act(() => {
        result.current.setFilter('system')
      })

      expect(mockSetFilter).toHaveBeenCalledWith('system')
    })

    it('should call setSearchQuery from useTemplates', () => {
      const { result } = renderHook(() => useTemplatesPage())

      act(() => {
        result.current.setSearchQuery('blog')
      })

      expect(mockSetSearchQuery).toHaveBeenCalledWith('blog')
    })
  })
})
