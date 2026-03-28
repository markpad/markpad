import { renderHook, act } from '@testing-library/react'
import { useUrlImport, validateUrl } from '@/hooks/useUrlImport'
import { clipFromUrl, buildClippedDocument } from '@/services/clipperService'

jest.mock('../services/clipperService', () => ({
  clipFromUrl: jest.fn(),
  buildClippedDocument: jest.fn(),
}))

const mockClipFromUrl = clipFromUrl as jest.MockedFunction<typeof clipFromUrl>
const mockBuildClippedDocument = buildClippedDocument as jest.MockedFunction<
  typeof buildClippedDocument
>

describe('useUrlImport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateUrl', () => {
    it('should accept http URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true)
    })

    it('should accept https URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true)
    })

    it('should accept URLs with paths', () => {
      expect(validateUrl('https://example.com/article/123')).toBe(true)
    })

    it('should reject ftp URLs', () => {
      expect(validateUrl('ftp://example.com')).toBe(false)
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(validateUrl('')).toBe(false)
    })

    it('should reject javascript: protocol', () => {
      // eslint-disable-next-line no-script-url
      expect(validateUrl('javascript:alert(1)')).toBe(false)
    })
  })

  describe('initial state', () => {
    it('should start with idle status', () => {
      const { result } = renderHook(() => useUrlImport())
      expect(result.current.status).toBe('idle')
    })

    it('should have no error', () => {
      const { result } = renderHook(() => useUrlImport())
      expect(result.current.error).toBeNull()
    })

    it('should have no result', () => {
      const { result } = renderHook(() => useUrlImport())
      expect(result.current.result).toBeNull()
    })

    it('should have empty URL', () => {
      const { result } = renderHook(() => useUrlImport())
      expect(result.current.url).toBe('')
    })

    it('should have isValidUrl as false initially', () => {
      const { result } = renderHook(() => useUrlImport())
      expect(result.current.isValidUrl).toBe(false)
    })
  })

  describe('setUrl', () => {
    it('should update the URL', () => {
      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      expect(result.current.url).toBe('https://example.com')
    })

    it('should update isValidUrl for valid URLs', () => {
      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should set isValidUrl false for invalid URLs', () => {
      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('not-a-url')
      })

      expect(result.current.isValidUrl).toBe(false)
    })
  })

  describe('importFromUrl', () => {
    it('should successfully import from a URL', async () => {
      const clipResult = {
        markdown: '# Article content',
        metadata: {
          title: 'Test Article',
          author: 'Author',
          excerpt: 'Excerpt',
          siteName: 'Example',
          source: 'https://example.com/article',
          clippedAt: '2024-01-01T00:00:00.000Z',
        },
      }
      mockClipFromUrl.mockResolvedValueOnce(clipResult)
      mockBuildClippedDocument.mockReturnValueOnce(
        '---\ntitle: Test Article\n---\n\n# Article content'
      )

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com/article')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('success')
      expect(result.current.error).toBeNull()
      expect(result.current.result).toEqual({
        content: '---\ntitle: Test Article\n---\n\n# Article content',
        title: 'Test Article',
        source: 'https://example.com/article',
      })
      expect(mockClipFromUrl).toHaveBeenCalledWith('https://example.com/article')
      expect(mockBuildClippedDocument).toHaveBeenCalledWith(clipResult)
    })

    it('should use fallback title when metadata title is empty', async () => {
      const clipResult = {
        markdown: '# Content',
        metadata: {
          title: '',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2024-01-01T00:00:00.000Z',
        },
      }
      mockClipFromUrl.mockResolvedValueOnce(clipResult)
      mockBuildClippedDocument.mockReturnValueOnce('# Content')

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.result?.title).toBe('Imported Article')
    })

    it('should error when URL is empty', async () => {
      const { result } = renderHook(() => useUrlImport())

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Please enter a URL.')
    })

    it('should error for invalid URL', async () => {
      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('not-a-url')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('Invalid URL')
    })

    it('should handle clipFromUrl errors', async () => {
      mockClipFromUrl.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Network error')
    })

    it('should handle non-Error rejections', async () => {
      mockClipFromUrl.mockRejectedValueOnce('something went wrong')

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Failed to import from URL.')
    })

    it('should trim the URL before validating and fetching', async () => {
      const clipResult = {
        markdown: '# Content',
        metadata: {
          title: 'Test',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2024-01-01T00:00:00.000Z',
        },
      }
      mockClipFromUrl.mockResolvedValueOnce(clipResult)
      mockBuildClippedDocument.mockReturnValueOnce('# Content')

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('  https://example.com  ')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(mockClipFromUrl).toHaveBeenCalledWith('https://example.com')
      expect(result.current.status).toBe('success')
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      mockClipFromUrl.mockResolvedValueOnce({
        markdown: '# C',
        metadata: {
          title: 'T',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2024-01-01T00:00:00.000Z',
        },
      })
      mockBuildClippedDocument.mockReturnValueOnce('# C')

      const { result } = renderHook(() => useUrlImport())

      act(() => {
        result.current.setUrl('https://example.com')
      })

      await act(async () => {
        await result.current.importFromUrl()
      })

      expect(result.current.status).toBe('success')

      act(() => {
        result.current.reset()
      })

      expect(result.current.status).toBe('idle')
      expect(result.current.error).toBeNull()
      expect(result.current.result).toBeNull()
      expect(result.current.url).toBe('')
    })
  })
})
