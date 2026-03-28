import nunjucks from 'nunjucks'
import type { LoopContext } from '@/lib/markdown-templating/types'

/**
 * Process loops in content using Nunjucks
 *
 * Supports all Nunjucks loop syntax:
 * - `{% for item in items %}...{% endfor %}`
 * - `{% for item in items %}...{% else %}...{% endfor %}`
 *
 * Inside loops you can access:
 * - `{{item}}` - the current item (for primitive arrays)
 * - `{{item.property}}` - nested properties (for object arrays)
 * - `{{loop.index}}` - 1-based index
 * - `{{loop.index0}}` - 0-based index
 * - `{{loop.first}}` - true if first iteration
 * - `{{loop.last}}` - true if last iteration
 *
 * Conditionals inside loops work naturally:
 * - `{% if item.active %}...{% endif %}`
 *
 * @example
 * processLoops('{% for name in names %}{{name}}{% endfor %}', { names: ['A', 'B'] })
 * // 'A\nB'
 *
 * @param content - The content with loop placeholders
 * @param data - The data containing arrays
 * @returns The content with loops expanded
 */
export function processLoops(content: string, data: Record<string, unknown>): string {
  try {
    return nunjucks.renderString(content, data)
  } catch {
    return content
  }
}

/**
 * Extract array variables from data
 * Useful for populating loop modal dropdown
 *
 * @param data - The data object
 * @returns Array of variable names that contain arrays
 */
export function extractArrayVariables(data: Record<string, unknown>): string[] {
  const arrays: string[] = []

  function traverse(obj: Record<string, unknown>, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key

      if (Array.isArray(value)) {
        arrays.push(fullPath)
      } else if (typeof value === 'object' && value !== null) {
        traverse(value as Record<string, unknown>, fullPath)
      }
    }
  }

  traverse(data)
  return arrays
}

/**
 * Generate a loop template string
 *
 * @param arrayName - The name of the array variable
 * @param iteratorName - The name of the iterator variable (default: 'item')
 * @param template - The template for each item (default: '- {{item}}')
 * @returns The complete loop string
 */
export function generateLoopTemplate(
  arrayName: string,
  iteratorName = 'item',
  template = `- {{${iteratorName}}}`
): string {
  return `{% for ${iteratorName} in ${arrayName} %}\n${template}\n{% endfor %}`
}

// Re-export types for backward compatibility
export type { LoopContext }
