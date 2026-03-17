import { renderHook, act } from '@testing-library/react'
import { useDocumentsPage } from './useDocumentsPage'

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
]

// Mock functions for assertions (implementations set in beforeEach)
const mockCreate = jest.fn()
const mockToggleStar = jest.fn()
const mockMoveToTrash = jest.fn()
const mockRestoreFromTrash = jest.fn()
const mockPermanentDelete = jest.fn()
const mockSetFilter = jest.fn()
const mockSetSearchQuery = jest.fn()
const mockRefresh = jest.fn()

// Mock useDocuments — use plain function to survive resetMocks
jest.mock('./useDocuments', () => ({
  __esModule: true,
  useDocuments: () => ({
    documents: mockDocuments,
    loading: false,
    error: null,
    filter: 'all',
    searchQuery: '',
    setFilter: mockSetFilter,
    setSearchQuery: mockSetSearchQuery,
    create: mockCreate,
    toggleStar: mockToggleStar,
    moveToTrash: mockMoveToTrash,
    restoreFromTrash: mockRestoreFromTrash,
    permanentDelete: mockPermanentDelete,
    refresh: mockRefresh,
  }),
}))

// Mock useImportModal
const mockImportModalOpen = jest.fn()
const mockImportModalClose = jest.fn()
const mockImportModalReset = jest.fn()
const mockFileImportReset = jest.fn()
const mockUrlImportReset = jest.fn()

jest.mock('./useImportModal', () => ({
  __esModule: true,
  useImportModal: () => ({
    isOpen: false,
    open: mockImportModalOpen,
    close: mockImportModalClose,
    activeTab: 'file' as const,
    setActiveTab: jest.fn(),
    fileImport: { status: 'idle', error: null, result: null, reset: mockFileImportReset },
    urlImport: { status: 'idle', error: null, result: null, url: '', reset: mockUrlImportReset },
    reset: mockImportModalReset,
  }),
}))

describe('useDocumentsPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()

    // Re-set spy implementations (cleared by CRA's resetMocks: true)
    ;(localStorageMock.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
      localStorageStore[key] = value
    })

    mockCreate.mockImplementation((title: string, content: string) =>
      Promise.resolve({
        id: 'new-doc-id',
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        starred: false,
        trashedAt: null,
      })
    )
    mockToggleStar.mockImplementation(() => Promise.resolve())
    mockMoveToTrash.mockImplementation(() => Promise.resolve())
    mockRestoreFromTrash.mockImplementation(() => Promise.resolve())
    mockPermanentDelete.mockImplementation(() => Promise.resolve())
    mockSetFilter.mockImplementation(() => {})
    mockSetSearchQuery.mockImplementation(() => {})
    mockRefresh.mockImplementation(() => {})
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

      expect(result.current.documents).toHaveLength(2)
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
    it('should open the import modal', () => {
      const { result } = renderHook(() => useDocumentsPage())

      act(() => {
        result.current.handleImportFile()
      })

      expect(mockImportModalOpen).toHaveBeenCalled()
    })
  })

  describe('handleImportContent', () => {
    it('should create document from imported content and navigate', async () => {
      const { result } = renderHook(() => useDocumentsPage())

      await act(async () => {
        await result.current.handleImportContent('# Imported Content', 'My Article')
      })

      expect(mockCreate).toHaveBeenCalledWith('My Article', '# Imported Content')
      expect(mockImportModalClose).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/editor/new-doc-id')
    })

    it('should use default title when none provided', async () => {
      const { result } = renderHook(() => useDocumentsPage())

      await act(async () => {
        await result.current.handleImportContent('# Content')
      })

      expect(mockCreate).toHaveBeenCalledWith('Imported Document', '# Content')
    })

    it('should expose importModal', () => {
      const { result } = renderHook(() => useDocumentsPage())

      expect(result.current.importModal).toBeDefined()
      expect(typeof result.current.importModal.open).toBe('function')
      expect(typeof result.current.importModal.close).toBe('function')
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
