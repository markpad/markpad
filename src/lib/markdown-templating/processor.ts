import nunjucks from 'nunjucks'
import { parse, serialize } from '@/lib/markdown-templating/parser'
import type { ProcessOptions, ProcessResult } from '@/lib/markdown-templating/types'

// Configure Nunjucks environment
// autoescape: false - we're rendering markdown, not HTML
// throwOnUndefined: false - undefined vars render as empty string
const env = new nunjucks.Environment(null, {
  autoescape: false,
  throwOnUndefined: false,
})

/**
 * Fix markdown tables that have blank lines between rows
 * (This happens when Nunjucks loops add extra whitespace)
 *
 * @param content - The rendered content
 * @returns Content with fixed table formatting
 */
function fixMarkdownTables(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check if this is a blank line between table rows
    if (trimmedLine === '') {
      // Look back to find last non-empty line
      let lastNonEmpty = result.length - 1
      while (lastNonEmpty >= 0 && result[lastNonEmpty].trim() === '') {
        lastNonEmpty--
      }

      // Look ahead to find next non-empty line
      let nextNonEmpty = i + 1
      while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === '') {
        nextNonEmpty++
      }

      const prevIsTableRow = lastNonEmpty >= 0 && result[lastNonEmpty].trim().startsWith('|')
      const nextIsTableRow =
        nextNonEmpty < lines.length && lines[nextNonEmpty].trim().startsWith('|')

      // Skip blank line if it's between table rows
      if (prevIsTableRow && nextIsTableRow) {
        continue
      }
    }

    result.push(line)
  }

  return result.join('\n')
}

/**
 * Process a markdown template with frontmatter and Nunjucks templating
 *
 * Uses Nunjucks (Jinja2-like) syntax:
 * - Variables: {{ variable }}, {{ nested.path }}
 * - Loops: {% for item in items %}...{% endfor %}
 * - Conditionals: {% if condition %}...{% elif %}...{% else %}...{% endif %}
 * - Filters: {{ name | upper }}, {{ price | round(2) }}
 * - Loop context: {{ loop.index }}, {{ loop.first }}, {{ loop.last }}
 *
 * @example
 * const result = process(`
 * ---
 * name: World
 * items: [A, B, C]
 * ---
 * Hello {{ name }}!
 * {% for item in items %}
 * - {{ item }}
 * {% endfor %}
 * `)
 * // result.content = 'Hello World!\n- A\n- B\n- C'
 *
 * @param markdown - The markdown string with optional frontmatter
 * @param options - Processing options
 * @returns Object with processed content, frontmatter, and original markdown
 */
export function process(markdown: string, options: ProcessOptions = {}): ProcessResult {
  const { variables = {} } = options

  const { content, frontmatter, raw } = parse(markdown)

  // Merge frontmatter data with custom variables (custom takes precedence)
  const data = { ...frontmatter, ...variables }

  // Render template using Nunjucks
  let processedContent: string
  try {
    processedContent = env.renderString(content, data)
    // Fix table formatting broken by Nunjucks whitespace
    processedContent = fixMarkdownTables(processedContent)
  } catch (error) {
    // If template rendering fails, return original content
    console.warn('Template rendering error:', error)
    processedContent = content
  }

  return {
    content: processedContent,
    frontmatter: data,
    raw,
  }
}

/**
 * Simple all-in-one render function
 *
 * @example
 * render('Hello {{ name }}!', { name: 'World' }) // 'Hello World!'
 *
 * render(`
 * ---
 * title: My Doc
 * ---
 * # {{ title }}
 * `) // '# My Doc'
 *
 * @param markdown - The markdown string with optional frontmatter
 * @param variables - Optional custom variables to use
 * @returns The processed content string
 */
export function render(markdown: string, variables?: Record<string, unknown>): string {
  return process(markdown, { variables }).content
}

/**
 * Update frontmatter in a markdown document
 *
 * @param markdown - The current markdown content
 * @param updates - Object with key-value pairs to add/update in frontmatter
 * @returns Updated markdown with modified frontmatter
 */
export function updateFrontmatter(markdown: string, updates: Record<string, unknown>): string {
  const { content, frontmatter } = parse(markdown)

  // Merge updates into frontmatter
  const newFrontmatter = { ...frontmatter, ...updates }

  // Rebuild markdown
  return serialize(newFrontmatter) + content
}

/**
 * Get the Nunjucks environment for advanced customization
 * Use this to add custom filters or globals
 *
 * @example
 * const env = getNunjucksEnv()
 * env.addFilter('currency', (val) => `$${val.toFixed(2)}`)
 */
export function getNunjucksEnv(): nunjucks.Environment {
  return env
}
