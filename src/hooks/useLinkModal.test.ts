import { renderHook, act } from '@testing-library/react'
import { useLinkModal } from '@/hooks/useLinkModal'

describe('useLinkModal', () => {
  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useLinkModal())
      expect(result.current.isOpen).toBe(false)
    })

    it('should initialize with default linkConfig', () => {
      const { result } = renderHook(() => useLinkModal())
      expect(result.current.linkConfig).toEqual({
        url: '',
        text: '',
      })
    })

    it('should initialize with isValidUrl as false', () => {
      const { result } = renderHook(() => useLinkModal())
      expect(result.current.isValidUrl).toBe(false)
    })
  })

  describe('Modal Controls', () => {
    it('should open modal', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.open()
      })

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('Configuration Updates', () => {
    it('should update url', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'https://example.com' })
      })

      expect(result.current.linkConfig.url).toBe('https://example.com')
    })

    it('should update text', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ text: 'Click here' })
      })

      expect(result.current.linkConfig.text).toBe('Click here')
    })

    it('should merge partial updates with existing config', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'https://example.com' })
      })

      act(() => {
        result.current.setLinkConfig({ text: 'Example Site' })
      })

      expect(result.current.linkConfig).toEqual({
        url: 'https://example.com',
        text: 'Example Site',
      })
    })
  })

  describe('Reset', () => {
    it('should reset linkConfig to defaults', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com',
          text: 'Test link',
        })
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.linkConfig).toEqual({
        url: '',
        text: '',
      })
    })
  })

  describe('Code Generation', () => {
    it('should generate markdown link code with url and text', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com',
          text: 'Example Site',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('[Example Site](https://example.com)')
    })

    it('should use URL as text when text is empty', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com',
          text: '',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('[https://example.com](https://example.com)')
    })

    it('should return empty string when no url', () => {
      const { result } = renderHook(() => useLinkModal())

      const code = result.current.generateLinkCode()
      expect(code).toBe('')
    })

    it('should handle URL with query parameters', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com?param=value&other=test',
          text: 'Search Results',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('[Search Results](https://example.com?param=value&other=test)')
    })

    it('should handle URL with anchor', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com#section',
          text: 'Go to Section',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('[Go to Section](https://example.com#section)')
    })
  })

  describe('URL Validation', () => {
    it('should validate valid HTTP URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'http://example.com' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate valid HTTPS URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'https://example.com' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should invalidate empty URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: '' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should invalidate malformed URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'not-a-valid-url' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should invalidate URL with only spaces', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: '   ' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should validate URL with path', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'https://example.com/path/to/page' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate URL with subdomain', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'https://subdomain.example.com' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate mailto URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'mailto:test@example.com' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate ftp URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: 'ftp://example.com/file.zip' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should invalidate relative URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({ url: '/relative/path' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })
  })

  describe('Text Handling', () => {
    it('should preserve text with special characters', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: 'https://example.com',
          text: 'Text with (parentheses) & [brackets]',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('[Text with (parentheses) & [brackets]](https://example.com)')
    })

    it('should handle empty text with whitespace-only URL', () => {
      const { result } = renderHook(() => useLinkModal())

      act(() => {
        result.current.setLinkConfig({
          url: '   ',
          text: '',
        })
      })

      const code = result.current.generateLinkCode()
      expect(code).toBe('')
    })
  })
})
