import { parse, serialize } from './parser'
import { interpolate } from './variables'
import { processConditionals } from './conditionals'
import { processLoops } from './loops'
import type { ProcessOptions, ProcessResult } from './types'

/**
 * Process a markdown template with frontmatter and Liquid-like syntax
 *
 * Processing order:
 * 1. Parse frontmatter
 * 2. Merge custom variables with frontmatter
 * 3. Process loops ({% for %}) - handles nested conditionals with loop context
 * 4. Process remaining top-level conditionals ({% if %})
 * 5. Interpolate variables ({{variable}})
 *
 * @example
 * const result = process(`
 * ---
 * name: World
 * items: [A, B, C]
 * ---
 * Hello {{name}}!
 * {% for item in items %}
 * - {{item}}
 * {% endfor %}
 * `)
 * // result.content = 'Hello World!\n- A\n- B\n- C'
 *
 * @param markdown - The markdown string with optional frontmatter
 * @param options - Processing options
 * @returns Object with processed content, frontmatter, and original markdown
 */
export function process(markdown: string, options: ProcessOptions = {}): ProcessResult {
  const { variables = {}, keepUndefined = true } = options

  const { content, frontmatter, raw } = parse(markdown)

  // Merge frontmatter data with custom variables (custom takes precedence)
  const data = { ...frontmatter, ...variables }

  // Process loops FIRST (handles conditionals inside loops with loop context)
  const loopsProcessed = processLoops(content, data)

  // Then process remaining top-level conditionals
  const conditionalsProcessed = processConditionals(loopsProcessed, data)

  // Finally interpolate variables
  const processedContent = interpolate(conditionalsProcessed, data, keepUndefined)

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
 * render('Hello {{name}}!', { name: 'World' }) // 'Hello World!'
 *
 * render(`
 * ---
 * title: My Doc
 * ---
 * # {{title}}
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
