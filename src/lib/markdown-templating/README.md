# markdown-templating

A powerful markdown templating engine built on [gray-matter](https://github.com/jonschlinkert/gray-matter) and [Nunjucks](https://mozilla.github.io/nunjucks/).

## Features

- ✅ YAML frontmatter parsing (via gray-matter)
- ✅ Variable interpolation: `{{variable}}`, `{{nested.path}}`
- ✅ Conditionals: `{% if %}...{% elif %}...{% else %}...{% endif %}`
- ✅ Loops: `{% for item in items %}...{% else %}...{% endfor %}`
- ✅ Loop context: `{{loop.index}}`, `{{loop.index0}}`, `{{loop.first}}`, `{{loop.last}}`
- ✅ Nested conditionals inside loops
- ✅ Nunjucks filters: `{{name | upper}}`, `{{items | join(', ')}}`
- ✅ Nunjucks macros, includes, and more
- ✅ TypeScript support

## Quick Start

```typescript
import { render, process, parse } from '@/lib/markdown-templating'

// Simple render with custom variables
const html = render('Hello {{name | capitalize}}!', { name: 'world' })
// => 'Hello World!'

// Process markdown with frontmatter
const { content, frontmatter } = process(`
---
title: My Document
---
# {{title}}
`)
// content => '# My Document'
// frontmatter => { title: 'My Document' }
```

## API Reference

### `render(markdown, variables?): string`

All-in-one function to process markdown and return the result.

```typescript
render('Hello {{name}}!', { name: 'World' })
// => 'Hello World!'
```

### `process(markdown, options?): ProcessResult`

Full processing with access to frontmatter and metadata.

```typescript
const result = process(markdown, {
  variables: { customVar: 'value' }, // Merge with frontmatter
})

result.content // Processed content
result.frontmatter // Merged data
result.raw // Original markdown
```

### `parse(markdown): ParseResult`

Parse frontmatter without processing templates.

```typescript
const { content, frontmatter, raw } = parse(`
---
title: Hello
---
# Content
`)
```

## Template Syntax

### Variables

Use double curly braces for variable interpolation:

```markdown
---
name: John
user:
  email: john@example.com
---

Hello {{name}}!
Contact: {{user.email}}
```

### Nunjucks Filters

Apply filters to transform values:

```markdown
---
name: john doe
items:
  - apple
  - banana
---

Name: {{name | title}}
Items: {{items | join(', ')}}
Length: {{name | length}}
```

**Built-in filters include:**

- `upper`, `lower`, `capitalize`, `title` - case transformations
- `trim`, `striptags` - string cleaning
- `first`, `last`, `length`, `join`, `sort`, `reverse` - array operations
- `default(value)` - fallback value
- `safe` - mark as safe HTML
- `round`, `abs`, `int`, `float` - number operations

See [Nunjucks filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters) for the full list.

### Conditionals

Nunjucks if/elif/else blocks:

```markdown
---
isAdmin: true
role: moderator
count: 5
---

{% if isAdmin %}
You have admin access.
{% endif %}

{% if not isAdmin %}
Limited access.
{% else %}
Full access.
{% endif %}

{% if role == "admin" %}
Admin role
{% elif role == "moderator" %}
Moderator role
{% else %}
Regular user
{% endif %}

{% if count > 3 %}
Many items
{% endif %}
```

**Supported operators:**

- Truthy check: `{% if variable %}`
- Negation: `{% if not variable %}`
- Equality: `{% if var == "value" %}` or `{% if var == 'value' %}`
- Inequality: `{% if var != "value" %}`
- Numeric: `{% if var > 10 %}`, `{% if var >= 10 %}`, `{% if var < 10 %}`, `{% if var <= 10 %}`
- Logic: `{% if a and b %}`, `{% if a or b %}`
- Contains: `{% if "needle" in haystack %}`

### Loops

Iterate over arrays:

```markdown
---
items:
  - Apple
  - Banana
  - Cherry
---

{% for item in items %}

- {{item}}
  {% endfor %}
```

**Output:**

```
- Apple
- Banana
- Cherry
```

### Loop with Objects

```markdown
---
users:
  - name: John
    role: admin
  - name: Jane
    role: user
---

{% for user in users %}

### {{user.name}}

Role: {{user.role}}
{% endfor %}
```

### Loop Context Variables

Inside loops, access metadata via `loop`:

| Variable          | Description                |
| ----------------- | -------------------------- |
| `{{loop.index}}`  | 1-based index (1, 2, 3...) |
| `{{loop.index0}}` | 0-based index (0, 1, 2...) |
| `{{loop.first}}`  | `true` if first iteration  |
| `{{loop.last}}`   | `true` if last iteration   |
| `{{loop.length}}` | Total number of items      |

```markdown
{% for item in items %}
{{loop.index}}. {{item}}{% if loop.last %} (last!){% endif %}
{% endfor %}
```

### Loop else Clause

The `{% else %}` clause renders when the array is empty:

```markdown
{% for item in items %}

- {{item}}
  {% else %}
  No items found.
  {% endfor %}
```

### Conditionals Inside Loops

Conditionals inside loops have access to the iterator:

```markdown
---
experiences:
  - company: TechCorp
    current: true
  - company: StartupX
    current: false
---

{% for exp in experiences %}

### {{exp.company}}

{% if exp.current %}
_Currently employed_
{% endif %}
{% endfor %}
```

## Utilities

### `extractArrayVariables(data): string[]`

Find all array paths in frontmatter data:

```typescript
import { extractArrayVariables } from '@/lib/markdown-templating'

const arrays = extractArrayVariables({
  items: [1, 2, 3],
  nested: { tags: ['a', 'b'] },
})
// => ['items', 'nested.tags']
```

### `generateLoopTemplate(arrayName, iteratorName?, template?): string`

Generate a loop template string:

```typescript
import { generateLoopTemplate } from '@/lib/markdown-templating'

generateLoopTemplate('items')
// => '{% for item in items %}\n- {{item}}\n{% endfor %}'

generateLoopTemplate('users', 'user', '{{user.name}}')
// => '{% for user in users %}\n{{user.name}}\n{% endfor %}'
```

### `generateIfTemplate(variable, content, elseContent?): string`

Generate a conditional template string:

```typescript
import { generateIfTemplate } from '@/lib/markdown-templating'

generateIfTemplate('isAdmin', 'Admin content')
// => '{% if isAdmin %}\nAdmin content\n{% endif %}'

generateIfTemplate('isAdmin', 'Admin', 'Guest')
// => '{% if isAdmin %}\nAdmin\n{% else %}\nGuest\n{% endif %}'
```

## Processing Order

Templates are processed by Nunjucks in a single pass, which handles:

1. **Parse** frontmatter from markdown (via gray-matter)
2. **Merge** custom variables with frontmatter (custom takes precedence)
3. **Render** all templates via Nunjucks (loops, conditionals, variables)

This ensures that conditionals inside loops (like `{% if item.active %}`) work correctly.

## Dependencies

- [gray-matter](https://github.com/jonschlinkert/gray-matter) - YAML frontmatter parsing
- [nunjucks](https://mozilla.github.io/nunjucks/) - Template engine

## TypeScript Types

```typescript
interface ParseResult {
  content: string // Markdown without frontmatter
  frontmatter: Record<string, unknown> // Parsed YAML data
  raw: string // Original markdown
}

interface ProcessOptions {
  variables?: Record<string, unknown> // Custom variables to merge
}

interface ProcessResult {
  content: string // Processed content
  frontmatter: Record<string, unknown> // Merged data
  raw: string // Original markdown
}

interface LoopContext {
  index: number // 1-based
  index0: number // 0-based
  first: boolean
  last: boolean
  length: number
}
```

## License

MIT
