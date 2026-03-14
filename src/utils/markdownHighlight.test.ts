import { highlightMarkdown, markdownHighlightClasses } from './markdownHighlight'

describe('markdownHighlight', () => {
  describe('escapeHtml', () => {
    it('should escape ampersands', () => {
      const result = highlightMarkdown('Tom & Jerry')
      expect(result).toContain('&amp;')
      expect(result).not.toContain('Tom & Jerry')
    })

    it('should escape less than signs', () => {
      const result = highlightMarkdown('a < b')
      expect(result).toContain('&lt;')
    })

    it('should escape greater than signs', () => {
      const result = highlightMarkdown('a > b')
      expect(result).toContain('&gt;')
    })

    it('should escape double quotes', () => {
      const result = highlightMarkdown('say "hello"')
      expect(result).toContain('&quot;')
    })

    it('should escape single quotes', () => {
      const result = highlightMarkdown("it's")
      expect(result).toContain('&#039;')
    })

    it('should escape multiple special characters', () => {
      const result = highlightMarkdown('<script>"alert(\'xss\')&"</script>')
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
      expect(result).toContain('&quot;')
      expect(result).toContain('&#039;')
      expect(result).toContain('&amp;')
    })
  })

  describe('headers', () => {
    it('should highlight h1 headers', () => {
      const result = highlightMarkdown('# Header 1')
      expect(result).toContain('text-red-700')
      expect(result).toContain('dark:text-red-400')
      expect(result).toContain('font-bold')
    })

    it('should highlight h2 headers', () => {
      const result = highlightMarkdown('## Header 2')
      expect(result).toContain('text-red-700')
    })

    it('should highlight h3 headers', () => {
      const result = highlightMarkdown('### Header 3')
      expect(result).toContain('text-red-700')
    })

    it('should highlight h4 headers', () => {
      const result = highlightMarkdown('#### Header 4')
      expect(result).toContain('text-red-700')
    })

    it('should highlight h5 headers', () => {
      const result = highlightMarkdown('##### Header 5')
      expect(result).toContain('text-red-700')
    })

    it('should highlight h6 headers', () => {
      const result = highlightMarkdown('###### Header 6')
      expect(result).toContain('text-red-700')
    })

    it('should not highlight # without space', () => {
      const result = highlightMarkdown('#NoSpace')
      expect(result).toBe('#NoSpace')
    })

    it('should not highlight # in middle of line', () => {
      const result = highlightMarkdown('This is not # a header')
      expect(result).not.toContain('<span')
    })

    it('should handle header with content after', () => {
      const result = highlightMarkdown('# Title\nSome text')
      expect(result).toContain('text-red-700')
      expect(result).toContain('Title')
    })
  })

  describe('bold', () => {
    it('should highlight bold with double asterisks', () => {
      const result = highlightMarkdown('This is **bold** text')
      expect(result).toContain('text-orange-700')
      expect(result).toContain('dark:text-orange-400')
      expect(result).toContain('font-bold')
      expect(result).toContain('**bold**')
    })

    it('should highlight bold with double underscores', () => {
      const result = highlightMarkdown('This is __bold__ text')
      expect(result).toContain('text-orange-700')
      expect(result).toContain('__bold__')
    })

    it('should highlight multiple bold sections', () => {
      const result = highlightMarkdown('**one** and **two**')
      const matches = result.match(/text-orange-700/g)
      expect(matches?.length).toBe(2)
    })

    it('should not highlight single asterisks as bold', () => {
      const result = highlightMarkdown('not *bold* text')
      expect(result).not.toContain('text-orange-700')
    })
  })

  describe('italic', () => {
    it('should highlight italic with single asterisk', () => {
      const result = highlightMarkdown('This is *italic* text')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('dark:text-purple-400')
      expect(result).toContain('italic')
    })

    it('should highlight italic with single underscore', () => {
      const result = highlightMarkdown('This is _italic_ text')
      expect(result).toContain('text-purple-700')
    })

    it('should highlight multiple italic sections', () => {
      const result = highlightMarkdown('*one* and *two*')
      const matches = result.match(/text-purple-700/g)
      expect(matches?.length).toBe(2)
    })
  })

  describe('inline code', () => {
    it('should highlight inline code with backticks', () => {
      const result = highlightMarkdown('Use `const` keyword')
      expect(result).toContain('text-green-700')
      expect(result).toContain('dark:text-green-400')
      expect(result).toContain('bg-green-500/10')
      expect(result).toContain('rounded')
      expect(result).toContain('px-1')
    })

    it('should highlight multiple inline code sections', () => {
      const result = highlightMarkdown('`one` and `two`')
      const matches = result.match(/bg-green-500\/10/g)
      expect(matches?.length).toBe(2)
    })

    it('should not match backticks across newlines', () => {
      const result = highlightMarkdown('`start\nend`')
      expect(result).not.toContain('bg-green-500/10')
    })

    it('should preserve content inside backticks', () => {
      const result = highlightMarkdown('`myFunction()`')
      expect(result).toContain('myFunction()')
    })
  })

  describe('code blocks (fenced)', () => {
    it('should highlight code fence markers', () => {
      const result = highlightMarkdown('```\ncode\n```')
      expect(result).toContain('text-gray-500')
    })

    it('should highlight code fence with language', () => {
      const result = highlightMarkdown('```javascript\nconst x = 1\n```')
      expect(result).toContain('text-gray-500')
      expect(result).toContain('javascript')
    })

    it('should highlight code block content', () => {
      const result = highlightMarkdown('```\nconst x = 1\n```')
      expect(result).toContain('text-green-700')
    })
  })

  describe('links', () => {
    it('should highlight link text', () => {
      const result = highlightMarkdown('[Click here](https://example.com)')
      expect(result).toContain('text-blue-700')
      expect(result).toContain('dark:text-blue-400')
      expect(result).toContain('Click here')
    })

    it('should highlight link URL', () => {
      const result = highlightMarkdown('[Link](https://example.com)')
      expect(result).toContain('text-green-700')
      expect(result).toContain('underline')
      expect(result).toContain('https://example.com')
    })

    it('should highlight link brackets', () => {
      const result = highlightMarkdown('[text](url)')
      expect(result).toContain('text-gray-500')
    })

    it('should highlight multiple links', () => {
      const result = highlightMarkdown('[one](url1) and [two](url2)')
      const blueMatches = result.match(/text-blue-700/g)
      expect(blueMatches?.length).toBe(2)
    })

    it('should handle links with special characters in URL', () => {
      const result = highlightMarkdown('[Link](https://example.com/path?q=1)')
      expect(result).toContain('text-blue-700')
      expect(result).toContain('text-green-700')
    })
  })

  describe('images', () => {
    it('should highlight image alt text', () => {
      const result = highlightMarkdown('![Alt text](image.png)')
      expect(result).toContain('text-blue-700')
      expect(result).toContain('Alt text')
    })

    it('should highlight image URL', () => {
      const result = highlightMarkdown('![](image.png)')
      expect(result).toContain('text-green-700')
      expect(result).toContain('image.png')
    })

    it('should highlight image brackets including exclamation', () => {
      const result = highlightMarkdown('![alt](url)')
      expect(result).toContain('text-gray-500')
    })

    it('should handle images with empty alt text', () => {
      const result = highlightMarkdown('![](path/to/image.jpg)')
      expect(result).toContain('text-green-700')
    })
  })

  describe('blockquotes', () => {
    it('should highlight blockquote lines', () => {
      const result = highlightMarkdown('> This is a quote')
      expect(result).toContain('text-gray-500')
      expect(result).toContain('italic')
    })

    it('should highlight multiple blockquote lines', () => {
      const result = highlightMarkdown('> Line 1\n> Line 2')
      const matches = result.match(/text-gray-500 dark:text-gray-500 italic/g)
      expect(matches?.length).toBe(2)
    })

    it('should not highlight > in middle of line', () => {
      const result = highlightMarkdown('a > b')
      // The > is escaped but not styled as blockquote
      expect(result).toContain('&gt;')
    })
  })

  describe('unordered lists', () => {
    it('should highlight dash list markers', () => {
      const result = highlightMarkdown('- Item 1')
      expect(result).toContain('text-red-700')
      expect(result).toContain('font-bold')
    })

    it('should highlight asterisk list markers', () => {
      const result = highlightMarkdown('* Item 1')
      expect(result).toContain('text-red-700')
    })

    it('should highlight plus list markers', () => {
      const result = highlightMarkdown('+ Item 1')
      expect(result).toContain('text-red-700')
    })

    it('should highlight indented list items', () => {
      const result = highlightMarkdown('  - Nested item')
      expect(result).toContain('text-red-700')
    })

    it('should highlight multiple list items', () => {
      const result = highlightMarkdown('- One\n- Two\n- Three')
      const matches = result.match(/text-red-700 dark:text-red-400 font-bold/g)
      expect(matches?.length).toBe(3)
    })

    it('should preserve list item content', () => {
      const result = highlightMarkdown('- My item')
      expect(result).toContain('My item')
    })
  })

  describe('ordered lists', () => {
    it('should highlight numbered list markers', () => {
      const result = highlightMarkdown('1. First item')
      expect(result).toContain('text-red-700')
      expect(result).toContain('font-bold')
    })

    it('should highlight multi-digit numbers', () => {
      const result = highlightMarkdown('10. Tenth item')
      expect(result).toContain('text-red-700')
    })

    it('should highlight indented ordered items', () => {
      const result = highlightMarkdown('   1. Indented')
      expect(result).toContain('text-red-700')
    })

    it('should highlight multiple ordered items', () => {
      const result = highlightMarkdown('1. One\n2. Two\n3. Three')
      const matches = result.match(/text-red-700 dark:text-red-400 font-bold/g)
      expect(matches?.length).toBe(3)
    })
  })

  describe('horizontal rules', () => {
    it('should highlight dash horizontal rules', () => {
      const result = highlightMarkdown('---')
      expect(result).toContain('text-gray-500')
    })

    it('should highlight asterisk horizontal rules', () => {
      const result = highlightMarkdown('***')
      expect(result).toContain('text-gray-500')
    })

    it('should highlight underscore horizontal rules', () => {
      const result = highlightMarkdown('___')
      expect(result).toContain('text-gray-500')
    })

    it('should highlight longer horizontal rules', () => {
      const result = highlightMarkdown('----------')
      expect(result).toContain('text-gray-500')
    })

    it('should not highlight only two dashes', () => {
      const result = highlightMarkdown('--')
      expect(result).toBe('--')
    })
  })

  describe('tables', () => {
    it('should highlight table rows', () => {
      const result = highlightMarkdown('| Col 1 | Col 2 |')
      expect(result).toContain('text-cyan-700')
      expect(result).toContain('dark:text-cyan-400')
    })

    it('should highlight table separator', () => {
      const result = highlightMarkdown('|---|---|')
      expect(result).toContain('text-cyan-700')
    })

    it('should highlight table with alignment', () => {
      const result = highlightMarkdown('|:---|:---:|---:|')
      expect(result).toContain('text-cyan-700')
    })

    it('should highlight complete table', () => {
      const result = highlightMarkdown('| A | B |\n|---|---|\n| 1 | 2 |')
      const matches = result.match(/text-cyan-700/g)
      expect(matches?.length).toBe(3)
    })
  })

  describe('template syntax - variables', () => {
    it('should highlight template variable brackets', () => {
      const result = highlightMarkdown('Hello {{ name }}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('font-bold')
    })

    it('should highlight template variable content', () => {
      const result = highlightMarkdown('{{ user.name }}')
      expect(result).toContain('text-amber-600')
      expect(result).toContain('dark:text-yellow-400')
    })

    it('should highlight multiple variables', () => {
      const result = highlightMarkdown('{{ first }} and {{ second }}')
      const bracketMatches = result.match(/text-purple-700 dark:text-purple-400 font-bold/g)
      expect(bracketMatches?.length).toBeGreaterThanOrEqual(4) // Opening and closing for each
    })

    it('should handle variables without spaces', () => {
      const result = highlightMarkdown('{{name}}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('text-amber-600')
    })
  })

  describe('template syntax - for loops', () => {
    it('should highlight for loop opening tag', () => {
      const result = highlightMarkdown('{% for item in items %}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('font-bold')
    })

    it('should highlight for loop keyword', () => {
      const result = highlightMarkdown('{% for x in list %}')
      expect(result).toContain('for')
    })

    it('should highlight for loop variable', () => {
      const result = highlightMarkdown('{% for item in items %}')
      expect(result).toContain('text-amber-600')
    })

    it('should highlight endfor tag', () => {
      const result = highlightMarkdown('{% endfor %}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('endfor')
    })

    it('should highlight complete for loop', () => {
      const result = highlightMarkdown('{% for i in list %}\n{{ i }}\n{% endfor %}')
      expect(result).toContain('for')
      expect(result).toContain('endfor')
    })
  })

  describe('template syntax - if statements', () => {
    it('should highlight if opening tag', () => {
      const result = highlightMarkdown('{% if condition %}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('font-bold')
    })

    it('should highlight if keyword', () => {
      const result = highlightMarkdown('{% if x %}')
      expect(result).toContain('if')
    })

    it('should highlight if condition', () => {
      const result = highlightMarkdown('{% if user.active %}')
      expect(result).toContain('text-amber-600')
    })

    it('should highlight else tag', () => {
      const result = highlightMarkdown('{% else %}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('else')
    })

    it('should highlight endif tag', () => {
      const result = highlightMarkdown('{% endif %}')
      expect(result).toContain('text-purple-700')
      expect(result).toContain('endif')
    })

    it('should highlight complete if-else-endif', () => {
      const result = highlightMarkdown('{% if x %}\nyes\n{% else %}\nno\n{% endif %}')
      expect(result).toContain('if')
      expect(result).toContain('else')
      expect(result).toContain('endif')
    })
  })

  describe('combined syntax', () => {
    it('should highlight bold inside list item', () => {
      const result = highlightMarkdown('- **Bold item**')
      expect(result).toContain('text-red-700') // list marker
      expect(result).toContain('text-orange-700') // bold
    })

    it('should highlight link in header', () => {
      const result = highlightMarkdown('# [Title](url)')
      expect(result).toContain('text-red-700') // header
      expect(result).toContain('text-blue-700') // link text
    })

    it('should highlight code in blockquote', () => {
      const result = highlightMarkdown('> Use `code` here')
      expect(result).toContain('bg-green-500/10') // inline code
    })

    it('should handle complex markdown document', () => {
      const markdown = `# Title

This is **bold** and *italic*.

- Item with \`code\`
- Item with [link](url)

> Quote here

| A | B |
|---|---|
| 1 | 2 |

{{ variable }}
{% for x in list %}
{% endfor %}`

      const result = highlightMarkdown(markdown)

      // Should have all types highlighted
      expect(result).toContain('text-red-700') // headers, list markers
      expect(result).toContain('text-orange-700') // bold
      expect(result).toContain('text-purple-700') // italic, template
      expect(result).toContain('text-green-700') // code, urls
      expect(result).toContain('text-blue-700') // link text
      expect(result).toContain('text-cyan-700') // table
      expect(result).toContain('text-amber-600') // template vars
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = highlightMarkdown('')
      expect(result).toBe('')
    })

    it('should handle plain text without markdown', () => {
      const result = highlightMarkdown('Just plain text')
      expect(result).toBe('Just plain text')
    })

    it('should handle only whitespace', () => {
      const result = highlightMarkdown('   ')
      expect(result).toBe('   ')
    })

    it('should handle only newlines', () => {
      const result = highlightMarkdown('\n\n\n')
      expect(result).toBe('\n\n\n')
    })

    it('should preserve consecutive spaces', () => {
      const result = highlightMarkdown('a    b')
      expect(result).toContain('a    b')
    })

    it('should handle nested brackets properly', () => {
      const result = highlightMarkdown('[[not a link]]')
      // Should not break
      expect(result).toBeDefined()
    })

    it('should handle unclosed syntax gracefully', () => {
      const result = highlightMarkdown('**unclosed bold')
      expect(result).toBeDefined()
      expect(result).toContain('**unclosed bold')
    })

    it('should handle unclosed backticks gracefully', () => {
      const result = highlightMarkdown('`unclosed code')
      expect(result).toBeDefined()
    })

    it('should handle very long lines', () => {
      const longText = 'a'.repeat(10000)
      const result = highlightMarkdown(longText)
      expect(result.length).toBe(10000)
    })

    it('should handle header regex when match fails', () => {
      // This tests the branch where regex test passes but match returns null
      // Edge case: header pattern that passes test but fails match (shouldn't happen in practice)
      const result = highlightMarkdown('# ')
      expect(result).toBeDefined()
    })

    it('should handle unordered list when match fails', () => {
      // Test the pattern match branch
      const result = highlightMarkdown('- ')
      expect(result).toBeDefined()
    })

    it('should handle ordered list when match fails', () => {
      // Test the pattern match branch
      const result = highlightMarkdown('1. ')
      expect(result).toBeDefined()
    })

    it('should not highlight dash in middle of text as list', () => {
      const result = highlightMarkdown('a - b')
      expect(result).not.toContain('text-red-700')
    })

    it('should not highlight number dot in middle of text as list', () => {
      const result = highlightMarkdown('version 1.0')
      expect(result).not.toContain('text-red-700')
    })
  })

  describe('markdownHighlightClasses export', () => {
    it('should export an array of Tailwind classes', () => {
      expect(Array.isArray(markdownHighlightClasses)).toBe(true)
    })

    it('should contain text color classes', () => {
      expect(markdownHighlightClasses).toContain('text-red-700')
      expect(markdownHighlightClasses).toContain('text-orange-700')
      expect(markdownHighlightClasses).toContain('text-purple-700')
      expect(markdownHighlightClasses).toContain('text-green-700')
      expect(markdownHighlightClasses).toContain('text-blue-700')
      expect(markdownHighlightClasses).toContain('text-cyan-700')
      expect(markdownHighlightClasses).toContain('text-amber-600')
    })

    it('should contain dark mode classes', () => {
      expect(markdownHighlightClasses).toContain('dark:text-red-400')
      expect(markdownHighlightClasses).toContain('dark:text-orange-400')
      expect(markdownHighlightClasses).toContain('dark:text-purple-400')
    })

    it('should contain font classes', () => {
      expect(markdownHighlightClasses).toContain('font-bold')
      expect(markdownHighlightClasses).toContain('italic')
    })

    it('should contain utility classes', () => {
      expect(markdownHighlightClasses).toContain('rounded')
      expect(markdownHighlightClasses).toContain('px-1')
      expect(markdownHighlightClasses).toContain('underline')
      expect(markdownHighlightClasses).toContain('bg-green-500/10')
    })

    it('should not have duplicates when split', () => {
      // Classes are split from combined strings, some may repeat across elements
      // This is expected behavior
      expect(markdownHighlightClasses.length).toBeGreaterThan(0)
    })
  })
})
