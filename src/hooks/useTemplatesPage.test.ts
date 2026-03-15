import { renderHook, act, waitFor } from '@testing-library/react'
import { useTemplatesPage } from './useTemplatesPage'

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

// Reference for assertions
const mockRefresh = jest.fn()
const mockSetFilter = jest.fn()
const mockSetSearchQuery = jest.fn()

// Mock useTemplates with inline data to avoid hoisting issues
jest.mock('./useTemplates', () => ({
  __esModule: true,
  useTemplates: () => ({
    templates: [
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
    ],
    loading: false,
    error: null,
    filter: 'all',
    searchQuery: '',
    setFilter: jest.fn(),
    setSearchQuery: jest.fn(),
    refresh: jest.fn(() => Promise.resolve()),
  }),
}))

// Mock seedService (uses __mocks__/seedService.ts)
jest.mock('../services/seedService')

// Mock documentRepository (uses __mocks__/index.ts)
jest.mock('../lib/repositories')

describe('useTemplatesPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
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
      const { seedSystemTemplates } = require('../services/seedService')
      renderHook(() => useTemplatesPage())

      await waitFor(() => {
        expect(seedSystemTemplates).toHaveBeenCalled()
        expect(mockRefresh).toHaveBeenCalled()
      })
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

      const { documentRepository } = require('../lib/repositories')
      expect(documentRepository.create).toHaveBeenCalledWith({
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

      const { documentRepository } = require('../lib/repositories')
      expect(documentRepository.create).toHaveBeenCalledWith(
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
