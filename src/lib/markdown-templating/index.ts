/**
 * markdown-templating
 *
 * A lightweight Liquid-like templating engine for markdown with YAML frontmatter.
 *
 * Features:
 * - YAML frontmatter parsing
 * - Variable interpolation: {{variable}}, {{nested.path}}
 * - Conditionals: {% if condition %}...{% else %}...{% endif %}
 * - Loops: {% for item in items %}...{% endfor %}
 * - Loop context: {{loop.index}}, {{loop.first}}, {{loop.last}}
 *
 * @example
 * import { render, process, parse } from '@/lib/markdown-templating'
 *
 * // Simple render
 * render('Hello {{name}}!', { name: 'World' }) // 'Hello World!'
 *
 * // Full processing
 * const { content, frontmatter } = process(markdown, { variables: customVars })
 *
 * @module markdown-templating
 */

// Main API
export { process, render, updateFrontmatter } from '@/lib/markdown-templating/processor'
export { parse, serialize } from '@/lib/markdown-templating/parser'

// Variable utilities
export { interpolate, getNestedValue } from '@/lib/markdown-templating/variables'

// Conditional utilities
export {
  processConditionals,
  evaluate as evaluateCondition,
  isTruthy,
  generateIfTemplate,
} from '@/lib/markdown-templating/conditionals'

// Loop utilities
export { processLoops, extractArrayVariables, generateLoopTemplate } from '@/lib/markdown-templating/loops'

// Types
export type { ParseResult, ProcessOptions, ProcessResult, LoopContext } from '@/lib/markdown-templating/types'
