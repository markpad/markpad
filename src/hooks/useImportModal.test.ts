import { renderHook, act } from '@testing-library/react'
import { useImportModal } from './useImportModal'

// Mock the sub-hooks to isolate the orchestrator
jest.mock('./useFileImport', () => ({
  useFileImport: () => ({
    status: 'idle',
    error: null,
    result: null,
    importFile: jest.fn(),
    openFilePicker: jest.fn(),
    reset: mockFileReset,
    fileInputRef: { current: null },
    handleFileInputChange: jest.fn(),
    handleDrop: jest.fn(),
    isDragging: false,
    handleDragEnter: jest.fn(),
    handleDragLeave: jest.fn(),
    handleDragOver: jest.fn(),
  }),
}))

jest.mock('./useUrlImport', () => ({
  useUrlImport: () => ({
    status: 'idle',
    error: null,
    result: null,
    url: '',
    setUrl: jest.fn(),
    importFromUrl: jest.fn(),
    isValidUrl: false,
    reset: mockUrlReset,
  }),
}))

const mockFileReset = jest.fn()
const mockUrlReset = jest.fn()

describe('useImportModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
