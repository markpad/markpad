import {
  parseFrontmatter,
  interpolateVariables,
  processMarkdownWithFrontmatter,
  processLoops,
  extractArrayVariables,
  generateLoopTemplate,
  addArrayToFrontmatter,
} from './frontmatter'

describe('frontmatter module', () => {
  describe('parseFrontmatter', () => {
    it('should parse frontmatter from markdown', () => {
      const markdown = `---
title: Hello World
author: John Doe
---

# Content here`

      const result = parseFrontmatter(markdown)

      expect(result.data).toEqual({
        title: 'Hello World',
        author: 'John Doe',
      })
      expect(result.content.trim()).toBe('# Content here')
    })

    it('should return empty data when no frontmatter', () => {
      const markdown = '# Just a heading'

      const result = parseFrontmatter(markdown)

      expect(result.data).toEqual({})
      expect(result.content).toBe(markdown)
    })

    it('should handle nested frontmatter values', () => {
      const markdown = `---
author:
  name: John Doe
  email: john@example.com
---

Content`

      const result = parseFrontmatter(markdown)

      expect(result.data).toEqual({
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      })
    })

    it('should handle arrays in frontmatter', () => {
      const markdown = `---
skills:
  - JavaScript
  - TypeScript
  - React
---

Content`

      const result = parseFrontmatter(markdown)

      expect(result.data.skills).toEqual(['JavaScript', 'TypeScript', 'React'])
    })

    it('should handle malformed YAML gracefully', () => {
      const markdown = `---
invalid: [unclosed
---

Content`

      const result = parseFrontmatter(markdown)

      expect(result.data).toEqual({})
      expect(result.content).toBe(markdown)
    })
  })

  describe('interpolateVariables', () => {
    it('should replace simple variables', () => {
      const content = 'Hello {{name}}, welcome to {{place}}!'
      const data = { name: 'Alice', place: 'Wonderland' }

      const result = interpolateVariables(content, data)

      expect(result).toBe('Hello Alice, welcome to Wonderland!')
    })

    it('should handle nested variables', () => {
      const content = 'Author: {{author.name}} ({{author.email}})'
      const data = {
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      }

      const result = interpolateVariables(content, data)

      expect(result).toBe('Author: John Doe (john@example.com)')
    })

    it('should leave undefined variables as-is', () => {
      const content = 'Hello {{name}}, your score is {{score}}'
      const data = { name: 'Alice' }

      const result = interpolateVariables(content, data)

      expect(result).toBe('Hello Alice, your score is {{score}}')
    })

    it('should handle variables with spaces around braces', () => {
      const content = 'Hello {{ name }}'
      const data = { name: 'Bob' }

      // Current implementation doesn't support spaces, so it should leave as-is
      const result = interpolateVariables(content, data)

      expect(result).toBe('Hello {{ name }}')
    })
  })

  describe('processLoops', () => {
    it('should expand simple loops', () => {
      const content = `{% for skill in skills %}
- {{skill}}
{% endfor %}`
      const data = { skills: ['JavaScript', 'TypeScript', 'React'] }

      const result = processLoops(content, data)

      expect(result).toContain('- JavaScript')
      expect(result).toContain('- TypeScript')
      expect(result).toContain('- React')
    })

    it('should handle object arrays with property access', () => {
      const content = `{% for job in jobs %}
### {{job.title}} at {{job.company}}
{% endfor %}`
      const data = {
        jobs: [
          { title: 'Developer', company: 'TechCo' },
          { title: 'Lead', company: 'StartupXYZ' },
        ],
      }

      const result = processLoops(content, data)

      expect(result).toContain('### Developer at TechCo')
      expect(result).toContain('### Lead at StartupXYZ')
    })

    it('should support loop.index (1-based)', () => {
      const content = `{% for item in items %}
{{loop.index}}. {{item}}
{% endfor %}`
      const data = { items: ['First', 'Second', 'Third'] }

      const result = processLoops(content, data)

      expect(result).toContain('1. First')
      expect(result).toContain('2. Second')
      expect(result).toContain('3. Third')
    })

    it('should support loop.index0 (0-based)', () => {
      const content = `{% for item in items %}
[{{loop.index0}}] {{item}}
{% endfor %}`
      const data = { items: ['A', 'B', 'C'] }

      const result = processLoops(content, data)

      expect(result).toContain('[0] A')
      expect(result).toContain('[1] B')
      expect(result).toContain('[2] C')
    })

    it('should support loop.first and loop.last', () => {
      const content = `{% for item in items %}
{{item}} (first: {{loop.first}}, last: {{loop.last}})
{% endfor %}`
      const data = { items: ['A', 'B', 'C'] }

      const result = processLoops(content, data)

      expect(result).toContain('A (first: true, last: false)')
      expect(result).toContain('B (first: false, last: false)')
      expect(result).toContain('C (first: false, last: true)')
    })

    it('should handle nested array paths', () => {
      const content = `{% for lang in developer.languages %}
- {{lang}}
{% endfor %}`
      const data = {
        developer: {
          languages: ['Python', 'Go', 'Rust'],
        },
      }

      const result = processLoops(content, data)

      expect(result).toContain('- Python')
      expect(result).toContain('- Go')
      expect(result).toContain('- Rust')
    })

    it('should remove loop when array not found', () => {
      const content = `Before
{% for item in nonexistent %}
- {{item}}
{% endfor %}
After`
      const data = {}

      const result = processLoops(content, data)

      expect(result).toContain('Before')
      expect(result).toContain('After')
      expect(result).not.toContain('{% for')
      expect(result).not.toContain('{% endfor')
    })

    it('should handle empty arrays', () => {
      const content = `{% for item in items %}
- {{item}}
{% endfor %}`
      const data = { items: [] }

      const result = processLoops(content, data)

      expect(result.trim()).toBe('')
    })

    it('should handle multiple loops', () => {
      const content = `## Skills
{% for skill in skills %}
- {{skill}}
{% endfor %}

## Languages
{% for lang in languages %}
- {{lang}}
{% endfor %}`
      const data = {
        skills: ['React', 'Node'],
        languages: ['English', 'Spanish'],
      }

      const result = processLoops(content, data)

      expect(result).toContain('- React')
      expect(result).toContain('- Node')
      expect(result).toContain('- English')
      expect(result).toContain('- Spanish')
    })
  })

  describe('processMarkdownWithFrontmatter', () => {
    it('should process complete markdown with frontmatter, variables, and loops', () => {
      const markdown = `---
title: My Resume
name: Jane Doe
skills:
  - JavaScript
  - TypeScript
---

# {{title}}

By {{name}}

## Skills
{% for skill in skills %}
- {{skill}}
{% endfor %}`

      const result = processMarkdownWithFrontmatter(markdown)

      expect(result.processedContent).toContain('# My Resume')
      expect(result.processedContent).toContain('By Jane Doe')
      expect(result.processedContent).toContain('- JavaScript')
      expect(result.processedContent).toContain('- TypeScript')
      expect(result.frontmatterData.title).toBe('My Resume')
    })

    it('should preserve original markdown', () => {
      const markdown = `---
name: Test
---

Hello {{name}}`

      const result = processMarkdownWithFrontmatter(markdown)

      expect(result.originalMarkdown).toBe(markdown)
    })
  })

  describe('extractArrayVariables', () => {
    it('should extract top-level arrays', () => {
      const data = {
        name: 'John',
        skills: ['JS', 'TS'],
        languages: ['English'],
      }

      const result = extractArrayVariables(data)

      expect(result).toContain('skills')
      expect(result).toContain('languages')
      expect(result).not.toContain('name')
    })

    it('should extract nested arrays', () => {
      const data = {
        work: {
          jobs: ['Dev', 'Lead'],
          current: {
            projects: ['A', 'B'],
          },
        },
      }

      const result = extractArrayVariables(data)

      expect(result).toContain('work.jobs')
      expect(result).toContain('work.current.projects')
    })

    it('should return empty array when no arrays', () => {
      const data = {
        name: 'John',
        age: 30,
      }

      const result = extractArrayVariables(data)

      expect(result).toEqual([])
    })
  })

  describe('generateLoopTemplate', () => {
    it('should generate default loop template', () => {
      const result = generateLoopTemplate('skills')

      expect(result).toBe('{% for item in skills %}\n- {{item}}\n{% endfor %}')
    })

    it('should use custom iterator name', () => {
      const result = generateLoopTemplate('jobs', 'job')

      expect(result).toContain('{% for job in jobs %}')
      expect(result).toContain('{{job}}')
    })

    it('should use custom template', () => {
      const result = generateLoopTemplate('items', 'item', '{{loop.index}}. {{item}}')

      expect(result).toBe('{% for item in items %}\n{{loop.index}}. {{item}}\n{% endfor %}')
    })
  })

  describe('addArrayToFrontmatter', () => {
    it('should add array to existing frontmatter', () => {
      const markdown = `---
title: Test
---

Content`
      const result = addArrayToFrontmatter(markdown, 'skills', ['JS', 'TS'])

      const parsed = parseFrontmatter(result)
      expect(parsed.data.title).toBe('Test')
      expect(parsed.data.skills).toEqual(['JS', 'TS'])
    })

    it('should create frontmatter if none exists', () => {
      const markdown = '# Just content'
      const result = addArrayToFrontmatter(markdown, 'items', ['A', 'B'])

      const parsed = parseFrontmatter(result)
      expect(parsed.data.items).toEqual(['A', 'B'])
      expect(parsed.content).toContain('# Just content')
    })

    it('should update existing array', () => {
      const markdown = `---
skills:
  - Old
---

Content`
      const result = addArrayToFrontmatter(markdown, 'skills', ['New1', 'New2'])

      const parsed = parseFrontmatter(result)
      expect(parsed.data.skills).toEqual(['New1', 'New2'])
    })
  })
})
