import { renderHook, act } from '@testing-library/react'
import { useExportPdf } from '@/hooks/useExportPdf'

// Mock the exportPdf utility
const mockExportPdf = jest.fn()
jest.mock('../utils/htmlGenerator', () => ({
  ...jest.requireActual('../utils/htmlGenerator'),
  exportPdf: (...args: unknown[]) => mockExportPdf(...args),
}))

const defaultOptions = {
  documentTitle: 'Test Document',
  htmlContent: '<h1>Hello</h1>',
  tailwindClasses: {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base',
    p: 'text-base leading-relaxed',
    a: 'text-blue-600',
    img: 'max-w-full',
    table: 'w-full',
    ul: 'list-disc pl-5',
    ol: 'list-decimal pl-5',
    li: 'mb-1',
    strong: 'font-bold',
    em: 'italic',
    tr: 'border-b',
    td: 'p-2',
    th: 'p-2 font-bold',
    blockquote: 'border-l-4 pl-4 italic',
    code: 'bg-gray-100 px-1 rounded',
    pre: 'bg-gray-100 p-4 rounded',
    body: 'bg-white text-gray-900',
    article: 'max-w-4xl mx-auto p-8',
  },
  fontFamily: 'Inter',
}

describe('useExportPdf', () => {
  beforeEach(() => {
    mockExportPdf.mockReset()
  })

  describe('Initial State', () => {
    it('should initialize with idle status', () => {
      const { result } = renderHook(() => useExportPdf())
      expect(result.current.status).toBe('idle')
    })

    it('should initialize with no error', () => {
      const { result } = renderHook(() => useExportPdf())
      expect(result.current.error).toBeNull()
    })

    it('should initialize with isExporting as false', () => {
      const { result } = renderHook(() => useExportPdf())
      expect(result.current.isExporting).toBe(false)
    })

    it('should provide handleExportPdf function', () => {
      const { result } = renderHook(() => useExportPdf())
      expect(typeof result.current.handleExportPdf).toBe('function')
    })

    it('should provide reset function', () => {
      const { result } = renderHook(() => useExportPdf())
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('Successful Export', () => {
    it('should set status to exporting when export starts', async () => {
      let resolveExport: () => void
      mockExportPdf.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveExport = resolve
          })
      )

      const { result } = renderHook(() => useExportPdf())

      // Start export but don't await
      act(() => {
        result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('exporting')
      expect(result.current.isExporting).toBe(true)

      // Clean up
      await act(async () => {
        resolveExport!()
      })
    })

    it('should set status to done after successful export', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('done')
      expect(result.current.isExporting).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should call exportPdf with the provided options', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(mockExportPdf).toHaveBeenCalledTimes(1)
      expect(mockExportPdf).toHaveBeenCalledWith(defaultOptions)
    })

    it('should pass different options correctly', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const customOptions = {
        ...defaultOptions,
        documentTitle: 'Custom Report',
        fontFamily: 'Roboto',
      }

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(customOptions)
      })

      expect(mockExportPdf).toHaveBeenCalledWith(customOptions)
    })
  })

  describe('Failed Export', () => {
    it('should set status to error when export fails', async () => {
      mockExportPdf.mockRejectedValue(new Error('PDF generation failed'))

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.isExporting).toBe(false)
    })

    it('should set error message from Error instance', async () => {
      mockExportPdf.mockRejectedValue(new Error('html2canvas timeout'))

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.error).toBe('html2canvas timeout')
    })

    it('should set fallback error message for non-Error throws', async () => {
      mockExportPdf.mockRejectedValue('some string error')

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.error).toBe('PDF export failed')
    })

    it('should clear previous error when starting new export', async () => {
      // First: fail
      mockExportPdf.mockRejectedValue(new Error('first failure'))

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.error).toBe('first failure')

      // Second: succeed
      mockExportPdf.mockResolvedValue(undefined)

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.status).toBe('done')
    })
  })

  describe('Reset', () => {
    it('should reset status to idle', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('done')

      act(() => {
        result.current.reset()
      })

      expect(result.current.status).toBe('idle')
    })

    it('should clear error on reset', async () => {
      mockExportPdf.mockRejectedValue(new Error('failure'))

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.error).toBe('failure')

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })

    it('should set isExporting to false on reset', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.isExporting).toBe(false)
    })
  })

  describe('Multiple Exports', () => {
    it('should handle multiple sequential exports', async () => {
      mockExportPdf.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('done')
      expect(mockExportPdf).toHaveBeenCalledTimes(1)

      await act(async () => {
        await result.current.handleExportPdf({
          ...defaultOptions,
          documentTitle: 'Second Export',
        })
      })

      expect(result.current.status).toBe('done')
      expect(mockExportPdf).toHaveBeenCalledTimes(2)
    })

    it('should recover from error and succeed on retry', async () => {
      // First call fails
      mockExportPdf.mockRejectedValueOnce(new Error('temporary failure'))

      const { result } = renderHook(() => useExportPdf())

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('error')

      // Second call succeeds
      mockExportPdf.mockResolvedValueOnce(undefined)

      await act(async () => {
        await result.current.handleExportPdf(defaultOptions)
      })

      expect(result.current.status).toBe('done')
      expect(result.current.error).toBeNull()
    })
  })
})
