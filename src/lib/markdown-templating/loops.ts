import { getNestedValue, interpolate } from './variables'
import { evaluate, processConditionals } from './conditionals'
import type { LoopContext } from './types'

/**
 * Process conditionals inside a loop with loop context
 * This handles conditions like {% if iterator.property %} within for loops
 */
function processConditionalsInLoop(content: string, context: Record<string, unknown>): string {
  // Match {% if expression %}...{% else %}...{% endif %} or {% if expression %}...{% endif %}
  const ifPattern = /\{%\s*if\s+([\s\S]*?)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g

  let result = content
  let match: RegExpExecArray | null

  while ((match = ifPattern.exec(result)) !== null) {
    const [fullMatch, expression, innerContent] = match

    // Split inner content on {% else %} if present
    const elseParts = innerContent.split(/\{%\s*else\s*%\}/)
    const trueBranch = elseParts[0]
    const falseBranch = elseParts.length > 1 ? elseParts[1] : ''

    const conditionResult = evaluate(expression, context)
    const replacement = conditionResult ? trueBranch.trim() : falseBranch.trim()

    result = result.replace(fullMatch, replacement)
    ifPattern.lastIndex = 0 // Reset since string changed
  }

  return result
}

/**
 * Process loops in content using Liquid-like syntax
 *
 * Supports: `{% for item in items %}...{% endfor %}`
 *
 * Inside loops you can access:
 * - `{{item}}` - the current item (for primitive arrays)
 * - `{{item.property}}` - nested properties (for object arrays)
 * - `{{loop.index}}` - 1-based index
 * - `{{loop.index0}}` - 0-based index
 * - `{{loop.first}}` - true if first iteration
 * - `{{loop.last}}` - true if last iteration
 *
 * Conditionals inside loops have access to the loop context:
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
  // Match {% for iteratorName in arrayName %}...{% endfor %}
  const loopPattern = /\{%\s*for\s+(\w+)\s+in\s+(\w+(?:\.\w+)*)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g

  let result = content
  let match: RegExpExecArray | null

  // Process all loops (need to reset lastIndex for each iteration since we modify the string)
  while ((match = loopPattern.exec(result)) !== null) {
    const [fullMatch, iteratorName, arrayName, loopContent] = match

    const arrayValue = getNestedValue(data, arrayName)

    if (!Array.isArray(arrayValue)) {
      // If array not found or not an array, remove the loop entirely
      result = result.replace(fullMatch, '')
      loopPattern.lastIndex = 0 // Reset since string changed
      continue
    }

    // Expand the loop
    const expandedContent = arrayValue
      .map((item, index) => {
        let expanded = loopContent

        // Create loop context with iterator and loop metadata
        const loopContext: Record<string, unknown> = {
          ...data,
          [iteratorName]: item,
          loop: {
            index: index + 1,
            index0: index,
            first: index === 0,
            last: index === arrayValue.length - 1,
          } satisfies LoopContext,
        }

        // Process conditionals inside the loop with loop context
        expanded = processConditionalsInLoop(expanded, loopContext)

        // Replace {{iteratorName}} with the item value
        const itemPattern = new RegExp(`\\{\\{\\s*${iteratorName}\\s*\\}\\}`, 'g')
        expanded = expanded.replace(itemPattern, String(item))

        // Support {{iteratorName.property}} for object items
        if (typeof item === 'object' && item !== null) {
          const propPattern = new RegExp(`\\{\\{\\s*${iteratorName}\\.([\\w.]+)\\s*\\}\\}`, 'g')
          expanded = expanded.replace(propPattern, (_, propPath: string) => {
            const value = getNestedValue(item as Record<string, unknown>, propPath)
            return value !== undefined ? String(value) : ''
          })
        }

        // Support {{loop.index}} (1-based) and {{loop.index0}} (0-based)
        expanded = expanded.replace(/\{\{\s*loop\.index\s*\}\}/g, String(index + 1))
        expanded = expanded.replace(/\{\{\s*loop\.index0\s*\}\}/g, String(index))
        expanded = expanded.replace(/\{\{\s*loop\.first\s*\}\}/g, String(index === 0))
        expanded = expanded.replace(
          /\{\{\s*loop\.last\s*\}\}/g,
          String(index === arrayValue.length - 1)
        )

        // Trim each item to avoid extra blank lines
        return expanded.trim()
      })
      .join('\n')

    result = result.replace(fullMatch, expandedContent)
    loopPattern.lastIndex = 0 // Reset since string changed
  }

  return result
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
