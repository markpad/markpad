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
  const loopsProcessed = processLoops(content, data)
  const processedContent = interpolateVariables(loopsProcessed, data)

  return {
    processedContent,
    originalMarkdown: original,
    frontmatterData: data,
  }
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

        return expanded
      })
      .join('')

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
