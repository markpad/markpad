import {
  parseFrontmatter,
  interpolateVariables,
  processMarkdownWithFrontmatter,
  processLoops,
  processConditionals,
  evaluateCondition,
  generateIfTemplate,
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

    it('should replace undefined variables with empty string', () => {
      const content = 'Hello {{name}}, your score is {{score}}'
      const data = { name: 'Alice' }

      const result = interpolateVariables(content, data)

      // Nunjucks replaces undefined variables with empty string
      expect(result).toBe('Hello Alice, your score is ')
    })

    it('should handle variables with spaces around braces', () => {
      const content = 'Hello {{ name }}'
      const data = { name: 'Bob' }

      // New implementation supports spaces around braces
      const result = interpolateVariables(content, data)

      expect(result).toBe('Hello Bob')
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

  describe('evaluateCondition', () => {
    it('should return true for truthy string values', () => {
      expect(evaluateCondition('name', { name: 'Alice' })).toBe(true)
    })

    it('should return false for undefined values', () => {
      expect(evaluateCondition('missing', {})).toBe(false)
    })

    it('should return false for null values', () => {
      expect(evaluateCondition('val', { val: null })).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(evaluateCondition('val', { val: '' })).toBe(false)
    })

    it('should return false for false boolean', () => {
      expect(evaluateCondition('active', { active: false })).toBe(false)
    })

    it('should return true for true boolean', () => {
      expect(evaluateCondition('active', { active: true })).toBe(true)
    })

    it('should return false for zero', () => {
      expect(evaluateCondition('count', { count: 0 })).toBe(false)
    })

    it('should return true for non-zero number', () => {
      expect(evaluateCondition('count', { count: 5 })).toBe(true)
    })

    it('should return true for non-empty array', () => {
      expect(evaluateCondition('items', { items: ['a'] })).toBe(true)
    })

    it('should return false for empty array', () => {
      expect(evaluateCondition('items', { items: [] })).toBe(false)
    })

    it('should handle nested paths', () => {
      expect(evaluateCondition('author.name', { author: { name: 'Alice' } })).toBe(true)
      expect(evaluateCondition('author.missing', { author: {} })).toBe(false)
    })

    it('should handle negation with "not"', () => {
      expect(evaluateCondition('not active', { active: true })).toBe(false)
      expect(evaluateCondition('not active', { active: false })).toBe(true)
      expect(evaluateCondition('not missing', {})).toBe(true)
    })

    it('should handle equality with double quotes', () => {
      expect(evaluateCondition('role == "admin"', { role: 'admin' })).toBe(true)
      expect(evaluateCondition('role == "admin"', { role: 'user' })).toBe(false)
    })

    it('should handle equality with single quotes', () => {
      expect(evaluateCondition("role == 'admin'", { role: 'admin' })).toBe(true)
    })

    it('should handle inequality', () => {
      expect(evaluateCondition('role != "admin"', { role: 'user' })).toBe(true)
      expect(evaluateCondition('role != "admin"', { role: 'admin' })).toBe(false)
    })

    it('should handle numeric comparisons', () => {
      expect(evaluateCondition('age > 18', { age: 25 })).toBe(true)
      expect(evaluateCondition('age > 18', { age: 10 })).toBe(false)
      expect(evaluateCondition('age < 18', { age: 10 })).toBe(true)
      expect(evaluateCondition('age >= 18', { age: 18 })).toBe(true)
      expect(evaluateCondition('age <= 18', { age: 18 })).toBe(true)
    })

    it('should return false for NaN in numeric comparisons', () => {
      expect(evaluateCondition('name > 5', { name: 'Alice' })).toBe(false)
    })
  })

  describe('processConditionals', () => {
    it('should show content when condition is truthy', () => {
      const content = '{% if showBio %}This is my bio{% endif %}'
      const data = { showBio: true }

      const result = processConditionals(content, data)

      expect(result).toBe('This is my bio')
    })

    it('should hide content when condition is falsy', () => {
      const content = '{% if showBio %}This is my bio{% endif %}'
      const data = { showBio: false }

      const result = processConditionals(content, data)

      expect(result).toBe('')
    })

    it('should handle else branch', () => {
      const content = '{% if premium %}Premium user{% else %}Free user{% endif %}'

      expect(processConditionals(content, { premium: true })).toBe('Premium user')
      expect(processConditionals(content, { premium: false })).toBe('Free user')
    })

    it('should handle undefined variable as falsy', () => {
      const content = '{% if unknown %}Visible{% else %}Hidden{% endif %}'

      expect(processConditionals(content, {})).toBe('Hidden')
    })

    it('should handle equality comparisons', () => {
      const content = '{% if role == "admin" %}Admin panel{% else %}User panel{% endif %}'

      expect(processConditionals(content, { role: 'admin' })).toBe('Admin panel')
      expect(processConditionals(content, { role: 'user' })).toBe('User panel')
    })

    it('should handle inequality comparisons', () => {
      const content = '{% if status != "draft" %}Published{% endif %}'

      expect(processConditionals(content, { status: 'published' })).toBe('Published')
      expect(processConditionals(content, { status: 'draft' })).toBe('')
    })

    it('should handle negation', () => {
      const content = '{% if not hideEmail %}email@example.com{% endif %}'

      expect(processConditionals(content, { hideEmail: false })).toBe('email@example.com')
      expect(processConditionals(content, { hideEmail: true })).toBe('')
    })

    it('should handle nested variable paths', () => {
      const content = '{% if author.verified %}Verified author{% endif %}'
      const data = { author: { verified: true } }

      expect(processConditionals(content, data)).toBe('Verified author')
    })

    it('should handle multiple conditionals', () => {
      const content = `{% if showName %}Alice{% endif %} - {% if showRole %}Developer{% endif %}`
      const data = { showName: true, showRole: false }

      const result = processConditionals(content, data)

      expect(result).toContain('Alice')
      expect(result).not.toContain('Developer')
    })

    it('should handle multiline content inside conditionals', () => {
      const content = `{% if showSection %}
## About Me

I am a developer.
{% endif %}`
      const data = { showSection: true }

      const result = processConditionals(content, data)

      expect(result).toContain('## About Me')
      expect(result).toContain('I am a developer.')
    })

    it('should handle numeric comparisons', () => {
      const content = '{% if experience > 5 %}Senior{% else %}Junior{% endif %}'

      expect(processConditionals(content, { experience: 10 })).toBe('Senior')
      expect(processConditionals(content, { experience: 2 })).toBe('Junior')
    })

    it('should handle array truthiness (non-empty = true)', () => {
      const content = '{% if skills %}Has skills{% else %}No skills{% endif %}'

      expect(processConditionals(content, { skills: ['JS'] })).toBe('Has skills')
      // Nunjucks (like Jinja2/Python) considers empty arrays truthy
      // Use {% if skills | length %} to check for empty arrays
      expect(processConditionals(content, { skills: [] })).toBe('Has skills')
    })

    it('should check array length for emptiness', () => {
      const content = '{% if skills | length %}Has skills{% else %}No skills{% endif %}'

      expect(processConditionals(content, { skills: ['JS'] })).toBe('Has skills')
      expect(processConditionals(content, { skills: [] })).toBe('No skills')
    })

    it('should handle conditionals combined with loops', () => {
      const content = `{% if showSkills %}
Skills:
{% for skill in skills %}
- {{skill}}
{% endfor %}
{% endif %}`
      const data = { showSkills: true, skills: ['JavaScript', 'TypeScript'] }

      const result = processConditionals(content, data)

      // Nunjucks processes both conditionals and loops in one pass
      expect(result).toContain('Skills:')
      expect(result).toContain('- JavaScript')
      expect(result).toContain('- TypeScript')
    })
  })

  describe('generateIfTemplate', () => {
    it('should generate simple if template', () => {
      const result = generateIfTemplate('showBio', 'This is my bio')

      expect(result).toBe('{% if showBio %}\nThis is my bio\n{% endif %}')
    })

    it('should generate if/else template', () => {
      const result = generateIfTemplate('premium', 'Premium content', 'Free content')

      expect(result).toBe(
        '{% if premium %}\nPremium content\n{% else %}\nFree content\n{% endif %}'
      )
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

    it('should process conditionals with variables and loops together', () => {
      const markdown = `---
title: Profile
showSkills: true
showBio: false
skills:
  - React
  - Node
---

# {{title}}

{% if showBio %}
## Bio
A developer.
{% endif %}

{% if showSkills %}
## Skills
{% for skill in skills %}
- {{skill}}
{% endfor %}
{% endif %}`

      const result = processMarkdownWithFrontmatter(markdown)

      expect(result.processedContent).toContain('# Profile')
      expect(result.processedContent).not.toContain('## Bio')
      expect(result.processedContent).toContain('## Skills')
      expect(result.processedContent).toContain('- React')
      expect(result.processedContent).toContain('- Node')
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
