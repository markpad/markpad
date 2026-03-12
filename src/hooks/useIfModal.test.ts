import { renderHook, act } from '@testing-library/react'
import { useIfModal } from './useIfModal'

const MARKDOWN_WITH_FRONTMATTER = `---
showAdvanced: true
isDraft: false
user:
  name: John Doe
  age: 25
  role: admin
tags:
  - react
  - typescript
---

# Test Content`

const MARKDOWN_WITHOUT_FRONTMATTER = `# Test Content`

describe('useIfModal', () => {
  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))
      expect(result.current.isOpen).toBe(false)
    })

    it('should initialize with default ifConfig', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))
      expect(result.current.ifConfig).toEqual({
        variableName: '',
        operator: 'truthy',
        compareValue: '',
        contentTemplate: 'Content to show when condition is true',
      })
    })

    it('should extract available variables from frontmatter', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))
      expect(result.current.availableVariables).toContain('showAdvanced')
      expect(result.current.availableVariables).toContain('isDraft')
      expect(result.current.availableVariables).toContain('user.name')
      expect(result.current.availableVariables).toContain('user.age')
      expect(result.current.availableVariables).toContain('user.role')
      expect(result.current.availableVariables).toContain('tags')
    })

    it('should return empty array when no frontmatter', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITHOUT_FRONTMATTER))
      expect(result.current.availableVariables).toEqual([])
    })

    it('should sort variables alphabetically', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))
      const vars = result.current.availableVariables
      const sortedVars = [...vars].sort()
      expect(vars).toEqual(sortedVars)
    })
  })

  describe('Modal Controls', () => {
    it('should open modal', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.open()
      })

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should auto-select first variable when opening modal', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.open()
      })

      expect(result.current.ifConfig.variableName).toBe(result.current.availableVariables[0])
    })

    it('should not auto-select if variable already set', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ variableName: 'user.age' })
      })

      act(() => {
        result.current.open()
      })

      expect(result.current.ifConfig.variableName).toBe('user.age')
    })

    it('should not auto-select when no variables available', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITHOUT_FRONTMATTER))

      act(() => {
        result.current.open()
      })

      expect(result.current.ifConfig.variableName).toBe('')
    })
  })

  describe('Configuration Updates', () => {
    it('should update variableName', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ variableName: 'user.age' })
      })

      expect(result.current.ifConfig.variableName).toBe('user.age')
    })

    it('should update operator', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ operator: '>=' })
      })

      expect(result.current.ifConfig.operator).toBe('>=')
    })

    it('should update compareValue', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ compareValue: '18' })
      })

      expect(result.current.ifConfig.compareValue).toBe('18')
    })

    it('should update contentTemplate', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ contentTemplate: 'Adult content' })
      })

      expect(result.current.ifConfig.contentTemplate).toBe('Adult content')
    })

    it('should merge partial updates with existing config', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({ variableName: 'user.age', operator: '>=' })
      })

      act(() => {
        result.current.setIfConfig({ compareValue: '18' })
      })

      expect(result.current.ifConfig).toEqual({
        variableName: 'user.age',
        operator: '>=',
        compareValue: '18',
        contentTemplate: 'Content to show when condition is true',
      })
    })
  })

  describe('Reset', () => {
    it('should reset ifConfig to defaults', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'user.age',
          operator: '>=',
          compareValue: '18',
          contentTemplate: 'Adult',
        })
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.ifConfig).toEqual({
        variableName: '',
        operator: 'truthy',
        compareValue: '',
        contentTemplate: 'Content to show when condition is true',
      })
    })
  })

  describe('Code Generation', () => {
    it('should generate if code for truthy operator', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'showAdvanced',
          operator: 'truthy',
          contentTemplate: 'Advanced content here',
        })
      })

      const code = result.current.generateIfCode()
      expect(code).toContain('{% if showAdvanced %}')
      expect(code).toContain('Advanced content here')
      expect(code).toContain('{% endif %}')
    })

    it('should generate if code for not operator', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'isDraft',
          operator: 'not',
          contentTemplate: 'Published content',
        })
      })

      const code = result.current.generateIfCode()
      expect(code).toContain('{% if not isDraft %}')
      expect(code).toContain('Published content')
      expect(code).toContain('{% endif %}')
    })

    it('should generate if code for == operator', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'user.role',
          operator: '==',
          compareValue: 'admin',
          contentTemplate: 'Admin panel',
        })
      })

      const code = result.current.generateIfCode()
      expect(code).toContain('{% if user.role == admin %}')
      expect(code).toContain('Admin panel')
      expect(code).toContain('{% endif %}')
    })

    it('should generate if code for >= operator', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'user.age',
          operator: '>=',
          compareValue: '18',
          contentTemplate: 'Adult content',
        })
      })

      const code = result.current.generateIfCode()
      expect(code).toContain('{% if user.age >= 18 %}')
      expect(code).toContain('Adult content')
      expect(code).toContain('{% endif %}')
    })

    it('should return empty string when no variable selected', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      const code = result.current.generateIfCode()
      expect(code).toBe('')
    })

    it('should update preview when config changes', () => {
      const { result } = renderHook(() => useIfModal(MARKDOWN_WITH_FRONTMATTER))

      act(() => {
        result.current.setIfConfig({
          variableName: 'showAdvanced',
          operator: 'truthy',
          contentTemplate: 'Preview content',
        })
      })

      expect(result.current.preview).toContain('{% if showAdvanced %}')
      expect(result.current.preview).toContain('Preview content')
    })
  })

  describe('Variable Extraction', () => {
    it('should extract nested object properties', () => {
      const markdown = `---
user:
  profile:
    name: John
    settings:
      theme: dark
---
Content`
      const { result } = renderHook(() => useIfModal(markdown))

      expect(result.current.availableVariables).toContain('user.profile.name')
      expect(result.current.availableVariables).toContain('user.profile.settings.theme')
    })

    it('should extract array variables', () => {
      const markdown = `---
tags:
  - react
  - vue
---
Content`
      const { result } = renderHook(() => useIfModal(markdown))

      expect(result.current.availableVariables).toContain('tags')
    })

    it('should handle mixed types in frontmatter', () => {
      const markdown = `---
title: My Post
count: 42
enabled: true
tags:
  - test
author:
  name: John
---
Content`
      const { result } = renderHook(() => useIfModal(markdown))

      expect(result.current.availableVariables).toContain('title')
      expect(result.current.availableVariables).toContain('count')
      expect(result.current.availableVariables).toContain('enabled')
      expect(result.current.availableVariables).toContain('tags')
      expect(result.current.availableVariables).toContain('author.name')
    })

    it('should handle null and undefined values gracefully', () => {
      const markdown = `---
nullValue: null
undefinedValue:
normalValue: test
---
Content`
      const { result } = renderHook(() => useIfModal(markdown))

      // Should not crash and should extract available variables
      expect(result.current.availableVariables).toBeDefined()
      expect(result.current.availableVariables).toContain('normalValue')
    })
  })
})
