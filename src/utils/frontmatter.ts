import yaml from 'js-yaml'

export interface FrontmatterResult {
  /** The markdown content without frontmatter */
  content: string
  /** The frontmatter data as an object */
  data: Record<string, unknown>
  /** The original markdown including frontmatter */
  original: string
}

export interface LoopMatch {
  /** The full match including {% for %} and {% endfor %} */
  fullMatch: string
  /** The iteration variable name (e.g., "item" in "for item in items") */
  iteratorName: string
  /** The array variable name (e.g., "items" in "for item in items") */
  arrayName: string
  /** The content inside the loop */
  loopContent: string
  /** Start index in the original string */
  startIndex: number
}

/**
 * Parse frontmatter from markdown content
 * Uses a browser-compatible approach (no Node.js dependencies)
 * @param markdown - The markdown string potentially containing frontmatter
 * @returns Object with parsed content, data, and original markdown
 */
export function parseFrontmatter(markdown: string): FrontmatterResult {
  // Match frontmatter block: starts with ---, ends with ---
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return {
      content: markdown,
      data: {},
      original: markdown,
    }
  }

  const yamlContent = match[1]
  const content = markdown.slice(match[0].length)

  try {
    const data = yaml.load(yamlContent) as Record<string, unknown>
    return {
      content,
      data: data || {},
      original: markdown,
    }
  } catch {
    // If YAML parsing fails, return original content with empty data
    return {
      content: markdown,
      data: {},
      original: markdown,
    }
  }
}

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to get the value from
 * @param path - The path to the value (e.g., "author.name")
 * @returns The value at the path, or undefined if not found
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Interpolate variables in markdown content using frontmatter data
 * Variables are in the format {{variableName}} or {{nested.path}}
 * Undefined variables are left as-is
 *
 * @param content - The markdown content with variable placeholders
 * @param data - The frontmatter data object
 * @returns The content with variables replaced by their values
 */
export function interpolateVariables(content: string, data: Record<string, unknown>): string {
  // Match {{variableName}} or {{nested.path.to.value}}
  const variablePattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\}\}/g

  return content.replace(variablePattern, (match, variablePath: string) => {
    const value = getNestedValue(data, variablePath)

    if (value === undefined || value === null) {
      // Return the original placeholder if variable not found
      return match
    }

    // Convert value to string
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  })
}

/**
 * Process markdown with frontmatter support
 * Parses frontmatter, removes it from content, and interpolates variables
 *
 * @param markdown - The markdown string with optional frontmatter
 * @returns Object with processed content and original markdown
 */
export function processMarkdownWithFrontmatter(markdown: string): {
  /** The processed markdown (frontmatter removed, variables interpolated) */
  processedContent: string
  /** The original markdown including frontmatter */
  originalMarkdown: string
  /** The frontmatter data */
  frontmatterData: Record<string, unknown>
} {
  const { content, data, original } = parseFrontmatter(markdown)
  const conditionalsProcessed = processConditionals(content, data)
  const loopsProcessed = processLoops(conditionalsProcessed, data)
  const processedContent = interpolateVariables(loopsProcessed, data)

  return {
    processedContent,
    originalMarkdown: original,
    frontmatterData: data,
  }
}

/**
 * Evaluate a condition expression against frontmatter data
 * Supports:
 *   - Truthy check: {% if variable %}
 *   - Equality: {% if variable == "value" %}
 *   - Inequality: {% if variable != "value" %}
 *   - Negation: {% if not variable %}
 *
 * @param expression - The condition expression to evaluate
 * @param data - The frontmatter data object
 * @returns Whether the condition is truthy
 */
export function evaluateCondition(expression: string, data: Record<string, unknown>): boolean {
  const trimmed = expression.trim()

  // Handle negation: "not variable"
  if (trimmed.startsWith('not ')) {
    const varPath = trimmed.slice(4).trim()
    return !isTruthy(getNestedValue(data, varPath))
  }

  // Handle equality: "variable == value"
  const eqMatch =
    trimmed.match(/^([\w.]+)\s*==\s*"([^"]*)"$/) || trimmed.match(/^([\w.]+)\s*==\s*'([^']*)'$/)
  if (eqMatch) {
    const value = getNestedValue(data, eqMatch[1])
    return String(value) === eqMatch[2]
  }

  // Handle inequality: "variable != value"
  const neqMatch =
    trimmed.match(/^([\w.]+)\s*!=\s*"([^"]*)"$/) || trimmed.match(/^([\w.]+)\s*!=\s*'([^']*)'$/)
  if (neqMatch) {
    const value = getNestedValue(data, neqMatch[1])
    return String(value) !== neqMatch[2]
  }

  // Handle numeric comparisons: >, <, >=, <=
  const cmpMatch = trimmed.match(/^([\w.]+)\s*(>=|<=|>|<)\s*(\d+(?:\.\d+)?)$/)
  if (cmpMatch) {
    const value = Number(getNestedValue(data, cmpMatch[1]))
    const operator = cmpMatch[2]
    const comparand = Number(cmpMatch[3])
    if (isNaN(value)) return false
    switch (operator) {
      case '>':
        return value > comparand
      case '<':
        return value < comparand
      case '>=':
        return value >= comparand
      case '<=':
        return value <= comparand
    }
  }

  // Simple truthy check: "variable"
  const value = getNestedValue(data, trimmed)
  return isTruthy(value)
}

/**
 * Check if a value is truthy in template context
 * Falsy: undefined, null, false, 0, empty string, empty array
 */
function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Process conditionals in content using Liquid-like syntax
 * Supports:
 *   - {% if condition %}...{% endif %}
 *   - {% if condition %}...{% else %}...{% endif %}
 *
 * @param content - The content with conditional placeholders
 * @param data - The frontmatter data containing values
 * @returns The content with conditionals resolved
 */
export function processConditionals(content: string, data: Record<string, unknown>): string {
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

    const conditionResult = evaluateCondition(expression, data)
    const replacement = conditionResult ? trueBranch.trim() : falseBranch.trim()

    result = result.replace(fullMatch, replacement)
    ifPattern.lastIndex = 0 // Reset since string changed
  }

  return result
}

/**
 * Generate an if template string
 *
 * @param variable - The variable name to check
 * @param content - The content to show when condition is true
 * @param elseContent - Optional content to show when condition is false
 * @returns The complete if template string
 */
export function generateIfTemplate(
  variable: string,
  content: string,
  elseContent?: string
): string {
  if (elseContent) {
    return `{% if ${variable} %}\n${content}\n{% else %}\n${elseContent}\n{% endif %}`
  }
  return `{% if ${variable} %}\n${content}\n{% endif %}`
}

/**
 * Process loops in content using Liquid-like syntax
 * Supports: {% for item in items %}...{% endfor %}
 *
 * @param content - The content with loop placeholders
 * @param data - The frontmatter data containing arrays
 * @returns The content with loops expanded
 */
export function processLoops(content: string, data: Record<string, unknown>): string {
  // Match {% for iteratorName in arrayName %}...{% endfor %}
  // Using non-greedy match for content and handling nested structures
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
 * Extract array variables from frontmatter data
 * Useful for populating loop modal dropdown
 *
 * @param data - The frontmatter data object
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

/**
 * Add or update an array in frontmatter
 *
 * @param markdown - The current markdown content
 * @param arrayName - The name for the array
 * @param items - The array items
 * @returns Updated markdown with the array in frontmatter
 */
export function addArrayToFrontmatter(
  markdown: string,
  arrayName: string,
  items: string[]
): string {
  const { content, data } = parseFrontmatter(markdown)

  // Add or update the array
  data[arrayName] = items

  // Rebuild frontmatter
  const yamlString = yaml.dump(data, { indent: 2, lineWidth: -1 })

  return `---\n${yamlString}---\n${content}`
}
