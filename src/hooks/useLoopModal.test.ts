import { renderHook, act } from '@testing-library/react'
import { useLoopModal } from './useLoopModal'

describe('useLoopModal', () => {
  const markdownWithArrays = `---
title: Test
skills:
  - JavaScript
  - TypeScript
languages:
  - English
  - Spanish
---

Content here`

  const markdownWithoutArrays = `---
title: Test
author: John
---

Content`

  // const markdownNoFrontmatter = '# Just content'  // Reserved for future tests

  describe('initial state', () => {
    it('should start with modal closed', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      expect(result.current.isOpen).toBe(false)
    })

    it('should extract available arrays from frontmatter', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      expect(result.current.availableArrays).toContain('skills')
      expect(result.current.availableArrays).toContain('languages')
    })

    it('should return empty arrays when no arrays in frontmatter', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithoutArrays))

      expect(result.current.availableArrays).toEqual([])
    })

    it('should have default loop config', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      expect(result.current.loopConfig.iteratorName).toBe('item')
      expect(result.current.loopConfig.itemTemplate).toBe('- {{item}}')
    })
  })

  describe('open/close', () => {
    it('should open the modal', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should auto-select first array when opening', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.open()
      })

      expect(result.current.loopConfig.arrayName).toBe('skills')
    })

    it('should close the modal', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.open()
      })

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('setLoopConfig', () => {
    it('should update loop configuration', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setLoopConfig({
          arrayName: 'languages',
          iteratorName: 'lang',
        })
      })

      expect(result.current.loopConfig.arrayName).toBe('languages')
      expect(result.current.loopConfig.iteratorName).toBe('lang')
    })

    it('should preserve unset config values', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setLoopConfig({ arrayName: 'skills' })
      })

      expect(result.current.loopConfig.iteratorName).toBe('item')
      expect(result.current.loopConfig.itemTemplate).toBe('- {{item}}')
    })
  })

  describe('new array mode', () => {
    it('should toggle new array mode', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      expect(result.current.isCreatingNewArray).toBe(false)

      act(() => {
        result.current.setIsCreatingNewArray(true)
      })

      expect(result.current.isCreatingNewArray).toBe(true)
    })

    it('should update new array config', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setNewArrayConfig({
          name: 'tools',
          items: ['Git', 'Docker'],
        })
      })

      expect(result.current.newArrayConfig.name).toBe('tools')
      expect(result.current.newArrayConfig.items).toEqual(['Git', 'Docker'])
    })
  })

  describe('generateLoopCode', () => {
    it('should generate loop code for existing array', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setLoopConfig({
          arrayName: 'skills',
          iteratorName: 'skill',
          itemTemplate: '- {{skill}}',
        })
      })

      const code = result.current.generateLoopCode()

      expect(code).toContain('{% for skill in skills %}')
      expect(code).toContain('- {{skill}}')
      expect(code).toContain('{% endfor %}')
    })

    it('should generate loop code for new array', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setIsCreatingNewArray(true)
        result.current.setNewArrayConfig({ name: 'tools' })
        result.current.setLoopConfig({ iteratorName: 'tool' })
      })

      const code = result.current.generateLoopCode()

      expect(code).toContain('{% for tool in tools %}')
    })

    it('should return empty string when no array selected', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      const code = result.current.generateLoopCode()

      expect(code).toBe('')
    })
  })

  describe('getUpdatedMarkdown', () => {
    it('should return original markdown when not creating new array', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      const updated = result.current.getUpdatedMarkdown()

      expect(updated).toBe(markdownWithArrays)
    })

    it('should add new array to frontmatter when creating', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setIsCreatingNewArray(true)
        result.current.setNewArrayConfig({
          name: 'tools',
          items: ['Git', 'Docker'],
        })
      })

      const updated = result.current.getUpdatedMarkdown()

      expect(updated).toContain('tools:')
      expect(updated).toContain('- Git')
      expect(updated).toContain('- Docker')
    })

    it('should not modify markdown if new array has no items', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setIsCreatingNewArray(true)
        result.current.setNewArrayConfig({
          name: 'tools',
          items: [],
        })
      })

      const updated = result.current.getUpdatedMarkdown()

      expect(updated).toBe(markdownWithArrays)
    })
  })

  describe('reset', () => {
    it('should reset all state to defaults', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setLoopConfig({
          arrayName: 'languages',
          iteratorName: 'lang',
        })
        result.current.setIsCreatingNewArray(true)
        result.current.setNewArrayConfig({ name: 'test', items: ['a', 'b'] })
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.loopConfig.arrayName).toBe('')
      expect(result.current.loopConfig.iteratorName).toBe('item')
      expect(result.current.isCreatingNewArray).toBe(false)
      expect(result.current.newArrayConfig.name).toBe('')
      expect(result.current.newArrayConfig.items).toEqual([])
    })
  })

  describe('preview', () => {
    it('should update preview when config changes', () => {
      const { result } = renderHook(() => useLoopModal(markdownWithArrays))

      act(() => {
        result.current.setLoopConfig({
          arrayName: 'skills',
          iteratorName: 'skill',
        })
      })

      expect(result.current.preview).toContain('{% for skill in skills %}')
    })
  })
})
