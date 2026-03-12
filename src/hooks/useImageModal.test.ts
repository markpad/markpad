import { renderHook, act } from '@testing-library/react'
import { useImageModal } from './useImageModal'

describe('useImageModal', () => {
  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useImageModal())
      expect(result.current.isOpen).toBe(false)
    })

    it('should initialize with default imageConfig', () => {
      const { result } = renderHook(() => useImageModal())
      expect(result.current.imageConfig).toEqual({
        url: '',
        altText: '',
      })
    })

    it('should initialize with isValidUrl as false', () => {
      const { result } = renderHook(() => useImageModal())
      expect(result.current.isValidUrl).toBe(false)
    })
  })

  describe('Modal Controls', () => {
    it('should open modal', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useImageModal())

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
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'https://example.com/image.jpg' })
      })

      expect(result.current.imageConfig.url).toBe('https://example.com/image.jpg')
    })

    it('should update altText', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ altText: 'A beautiful sunset' })
      })

      expect(result.current.imageConfig.altText).toBe('A beautiful sunset')
    })

    it('should merge partial updates with existing config', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'https://example.com/image.jpg' })
      })

      act(() => {
        result.current.setImageConfig({ altText: 'Description' })
      })

      expect(result.current.imageConfig).toEqual({
        url: 'https://example.com/image.jpg',
        altText: 'Description',
      })
    })
  })

  describe('Reset', () => {
    it('should reset imageConfig to defaults', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({
          url: 'https://example.com/image.jpg',
          altText: 'Test image',
        })
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.imageConfig).toEqual({
        url: '',
        altText: '',
      })
    })
  })

  describe('Code Generation', () => {
    it('should generate markdown image code with url and alt text', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({
          url: 'https://example.com/image.jpg',
          altText: 'Beautiful sunset',
        })
      })

      const code = result.current.generateImageCode()
      expect(code).toBe('![Beautiful sunset](https://example.com/image.jpg)')
    })

    it('should generate markdown image code with url only', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({
          url: 'https://example.com/image.jpg',
          altText: '',
        })
      })

      const code = result.current.generateImageCode()
      expect(code).toBe('![](https://example.com/image.jpg)')
    })

    it('should return empty string when no url', () => {
      const { result } = renderHook(() => useImageModal())

      const code = result.current.generateImageCode()
      expect(code).toBe('')
    })
  })

  describe('URL Validation', () => {
    it('should validate valid HTTP URL', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'http://example.com/image.jpg' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate valid HTTPS URL', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'https://example.com/image.png' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should invalidate empty URL', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: '' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should invalidate malformed URL', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'not-a-valid-url' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should invalidate URL with only spaces', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: '   ' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })

    it('should validate data URI', () => {
      const { result } = renderHook(() => useImageModal())

      act(() => {
        result.current.setImageConfig({ url: 'data:image/png;base64,iVBORw0KGgoAAAANS' })
      })

      expect(result.current.isValidUrl).toBe(true)
    })

    it('should validate relative URL starting with slash', () => {
      const { result } = renderHook(() => useImageModal())

      // Note: Relative URLs are NOT valid URLs according to URL constructor
      // They need a base URL. This test documents current behavior.
      act(() => {
        result.current.setImageConfig({ url: '/images/photo.jpg' })
      })

      expect(result.current.isValidUrl).toBe(false)
    })
  })
})
