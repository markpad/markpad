import { renderHook, act } from '@testing-library/react'
import { useImportModal } from '@/hooks/useImportModal'

// Mock the sub-hooks to isolate the orchestrator
vi.mock('./useFileImport', () => ({
  useFileImport: () => ({
    status: 'idle',
    error: null,
    result: null,
    importFile: vi.fn(),
    openFilePicker: vi.fn(),
    reset: mockFileReset,
    fileInputRef: { current: null },
    handleFileInputChange: vi.fn(),
    handleDrop: vi.fn(),
    isDragging: false,
    handleDragEnter: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDragOver: vi.fn(),
  }),
}))

vi.mock('./useUrlImport', () => ({
  useUrlImport: () => ({
    status: 'idle',
    error: null,
    result: null,
    url: '',
    setUrl: vi.fn(),
    importFromUrl: vi.fn(),
    isValidUrl: false,
    reset: mockUrlReset,
  }),
}))

const mockFileReset = vi.fn()
const mockUrlReset = vi.fn()

describe('useImportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should start closed', () => {
      const { result } = renderHook(() => useImportModal())
      expect(result.current.isOpen).toBe(false)
    })

    it('should default to file tab', () => {
      const { result } = renderHook(() => useImportModal())
      expect(result.current.activeTab).toBe('file')
    })

    it('should expose fileImport hook', () => {
      const { result } = renderHook(() => useImportModal())
      expect(result.current.fileImport).toBeDefined()
      expect(result.current.fileImport.status).toBe('idle')
    })

    it('should expose urlImport hook', () => {
      const { result } = renderHook(() => useImportModal())
      expect(result.current.urlImport).toBeDefined()
      expect(result.current.urlImport.status).toBe('idle')
    })
  })

  describe('open/close', () => {
    it('should open the modal', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should reset state when opening', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.open()
      })

      expect(mockFileReset).toHaveBeenCalled()
      expect(mockUrlReset).toHaveBeenCalled()
    })

    it('should close the modal', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.open()
      })
      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.close()
      })
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('tab switching', () => {
    it('should switch to url tab', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.setActiveTab('url')
      })

      expect(result.current.activeTab).toBe('url')
    })

    it('should switch back to file tab', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.setActiveTab('url')
      })

      act(() => {
        result.current.setActiveTab('file')
      })

      expect(result.current.activeTab).toBe('file')
    })
  })

  describe('reset', () => {
    it('should reset both sub-hooks and tab', () => {
      const { result } = renderHook(() => useImportModal())

      act(() => {
        result.current.setActiveTab('url')
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.activeTab).toBe('file')
      expect(mockFileReset).toHaveBeenCalled()
      expect(mockUrlReset).toHaveBeenCalled()
    })
  })
})
