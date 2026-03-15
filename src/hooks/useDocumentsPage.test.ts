import { renderHook, act, waitFor } from '@testing-library/react'
import { useDocumentsPage } from './useDocumentsPage'

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
const mockDocuments = [
  {
    id: 'doc-1',
    title: 'First Document',
    content: '# Hello World',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    starred: false,
    trashedAt: null,
  },
  {
    id: 'doc-2',
    title: 'Starred Document',
    content: '# Starred',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    starred: true,
    trashedAt: null,
  },
  {
    id: 'doc-3',
    title: 'Trashed Document',
    content: '# Trashed',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
    starred: false,
    trashedAt: new Date('2024-01-06'),
  },
]

// These are references used for test assertions
const mockCreate = jest.fn()
const mockToggleStar = jest.fn()
const mockMoveToTrash = jest.fn()
const mockRestoreFromTrash = jest.fn()
const mockPermanentDelete = jest.fn()
const mockSetFilter = jest.fn()
const mockSetSearchQuery = jest.fn()

// Mock useDocuments with inline data to avoid hoisting issues
jest.mock('./useDocuments', () => {
  const documents = [
    {
      id: 'doc-1',
      title: 'First Document',
      content: '# Hello World',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      starred: false,
      trashedAt: null,
    },
    {
      id: 'doc-2',
      title: 'Starred Document',
      content: '# Starred',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-10'),
      starred: true,
      trashedAt: null,
    },
  ]

  return {
    useDocuments: () => ({
      documents,
      loading: false,
      error: null,
      filter: 'all',
      searchQuery: '',
      setFilter: jest.fn(),
      setSearchQuery: jest.fn(),
      create: jest.fn((title: string, content: string) =>
        Promise.resolve({
          id: 'new-doc-id',
          title,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          starred: false,
          trashedAt: null,
        })
      ),
      toggleStar: jest.fn(() => Promise.resolve()),
      moveToTrash: jest.fn(() => Promise.resolve()),
      restoreFromTrash: jest.fn(() => Promise.resolve()),
      permanentDelete: jest.fn(() => Promise.resolve()),
      refresh: jest.fn(),
    }),
  }
})

describe('useDocumentsPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have default view mode as grid', () => {
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.viewMode).toBe('grid')
    })

    it('should load view mode from localStorage', () => {
      localStorageMock.setItem('markpad-view-mode', 'list')
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.viewMode).toBe('list')
    })

    it('should expose documents from useDocuments', () => {
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.documents).toHaveLength(2) // excludes trashed
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('view mode', () => {
    it('should change view mode and persist to localStorage', () => {
      const { result } = renderHook(() => useDocumentsPage())

      act(() => {
        result.current.handleViewModeChange('list')
      })

      expect(result.current.viewMode).toBe('list')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('markpad-view-mode', 'list')
    })

    it('should change back to grid', () => {
      localStorageMock.setItem('markpad-view-mode', 'list')
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.viewMode).toBe('list')

      act(() => {
        result.current.handleViewModeChange('grid')
      })

      expect(result.current.viewMode).toBe('grid')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('markpad-view-mode', 'grid')
    })
  })

  describe('handleNewDocument', () => {
    it('should create a new document and navigate to editor', async () => {
      const { result } = renderHook(() => useDocumentsPage())

      await act(async () => {
        await result.current.handleNewDocument()
      })

      expect(mockCreate).toHaveBeenCalledWith(
        'Untitled Document',
        '# New Document\n\nStart writing...'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/editor/new-doc-id')
    })
  })

  describe('handleOpenDocument', () => {
    it('should navigate to editor with document id', () => {
      const { result } = renderHook(() => useDocumentsPage())
      const doc = mockDocuments[0]

      act(() => {
        result.current.handleOpenDocument(doc as any)
      })

      expect(mockNavigate).toHaveBeenCalledWith('/editor/doc-1')
    })
  })

  describe('handleImportFile', () => {
    it('should create file input and set up handlers', () => {
      const createElementSpy = jest.spyOn(document, 'createElement')
      const clickSpy = jest.fn()

      const { result } = renderHook(() => useDocumentsPage())

      // Mock the input element
      const mockInput = {
        type: '',
        accept: '',
        onchange: null as ((e: any) => void) | null,
        click: clickSpy,
      }
      createElementSpy.mockReturnValue(mockInput as any)

      act(() => {
        result.current.handleImportFile()
      })

      expect(createElementSpy).toHaveBeenCalledWith('input')
      expect(mockInput.type).toBe('file')
      expect(mockInput.accept).toBe('.md,.markdown,.txt')
      expect(clickSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
    })

    it('should create document from imported file', async () => {
      const createElementSpy = jest.spyOn(document, 'createElement')

      const { result } = renderHook(() => useDocumentsPage())

      let capturedOnchange: ((e: any) => void) | null = null
      const mockInput = {
        type: '',
        accept: '',
        set onchange(fn: ((e: any) => void) | null) {
          capturedOnchange = fn
        },
        get onchange() {
          return capturedOnchange
        },
        click: jest.fn(),
      }
      createElementSpy.mockReturnValue(mockInput as any)

      act(() => {
        result.current.handleImportFile()
      })

      // Simulate file selection
      const mockFile = {
        name: 'test-document.md',
        text: jest.fn().mockResolvedValue('# Imported Content'),
      }

      await act(async () => {
        if (capturedOnchange) {
          await capturedOnchange({
            target: { files: [mockFile] },
          })
        }
      })

      expect(mockFile.text).toHaveBeenCalled()
      expect(mockCreate).toHaveBeenCalledWith('test-document', '# Imported Content')
      expect(mockNavigate).toHaveBeenCalledWith('/editor/new-doc-id')

      createElementSpy.mockRestore()
    })

    it('should not create document if no file selected', async () => {
      const createElementSpy = jest.spyOn(document, 'createElement')

      const { result } = renderHook(() => useDocumentsPage())

      let capturedOnchange: ((e: any) => void) | null = null
      const mockInput = {
        type: '',
        accept: '',
        set onchange(fn: ((e: any) => void) | null) {
          capturedOnchange = fn
        },
        get onchange() {
          return capturedOnchange
        },
        click: jest.fn(),
      }
      createElementSpy.mockReturnValue(mockInput as any)

      act(() => {
        result.current.handleImportFile()
      })

      // Simulate no file selected
      await act(async () => {
        if (capturedOnchange) {
          await capturedOnchange({
            target: { files: null },
          })
        }
      })

      expect(mockCreate).not.toHaveBeenCalled()

      createElementSpy.mockRestore()
    })
  })

  describe('passthrough from useDocuments', () => {
    it('should expose filter-related functions', () => {
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.filter).toBe('all')
      expect(result.current.searchQuery).toBe('')
      expect(typeof result.current.setFilter).toBe('function')
      expect(typeof result.current.setSearchQuery).toBe('function')
    })

    it('should expose document action functions', () => {
      const { result } = renderHook(() => useDocumentsPage())

      expect(typeof result.current.toggleStar).toBe('function')
      expect(typeof result.current.moveToTrash).toBe('function')
      expect(typeof result.current.restoreFromTrash).toBe('function')
      expect(typeof result.current.permanentDelete).toBe('function')
    })

    it('should call toggleStar from useDocuments', async () => {
      const { result } = renderHook(() => useDocumentsPage())

      await act(async () => {
        await result.current.toggleStar('doc-1')
      })

      expect(mockToggleStar).toHaveBeenCalledWith('doc-1')
    })

    it('should call moveToTrash from useDocuments', async () => {
      const { result } = renderHook(() => useDocumentsPage())

      await act(async () => {
        await result.current.moveToTrash('doc-1')
      })

      expect(mockMoveToTrash).toHaveBeenCalledWith('doc-1')
    })
  })
})
