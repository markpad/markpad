import yaml from 'js-yaml'

interface FrontmatterResult {
  /** The markdown content without frontmatter */
  content: string
  /** The frontmatter data as an object */
  data: Record<string, unknown>
  /** The original markdown including frontmatter */
  original: string
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
  const processedContent = interpolateVariables(content, data)

  return {
    processedContent,
    originalMarkdown: original,
    frontmatterData: data,
  }
}
