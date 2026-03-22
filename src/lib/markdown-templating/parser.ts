import yaml from 'js-yaml'
import type { ParseResult } from './types'

// Regex to match frontmatter: starts with ---, captures YAML, ends with ---
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * Parse frontmatter from markdown content
 *
 * Frontmatter is YAML content between --- delimiters at the start of the file:
 * ```
 * ---
 * title: Hello
 * author: John
 * ---
 * # Content here
 * ```
 *
 * @param markdown - The markdown string potentially containing frontmatter
 * @returns Object with parsed content, frontmatter data, and original markdown
 */
export function parse(markdown: string): ParseResult {
  try {
    const match = markdown.match(FRONTMATTER_REGEX)

    if (!match) {
      return {
        content: markdown,
        frontmatter: {},
        raw: markdown,
      }
    }

    const yamlContent = match[1]
    const content = markdown.slice(match[0].length)
    const frontmatter = yaml.load(yamlContent) as Record<string, unknown>

    // Ensure frontmatter is always an object, not a scalar value
    // This prevents the bug where spreading a string creates indexed properties
    const safeFrontmatter =
      frontmatter && typeof frontmatter === 'object' && !Array.isArray(frontmatter)
        ? frontmatter
        : {}

    return {
      content,
      frontmatter: safeFrontmatter,
      raw: markdown,
    }
  } catch {
    // If parsing fails, return original content with empty data
    return {
      content: markdown,
      frontmatter: {},
      raw: markdown,
    }
  }
}

/**
 * Serialize frontmatter data back to YAML string with --- delimiters
 *
 * @param data - The frontmatter data object
 * @returns YAML string with --- delimiters
 */
export function serialize(data: Record<string, unknown>): string {
  if (Object.keys(data).length === 0) {
    return ''
  }
  const yamlStr = yaml.dump(data, { lineWidth: -1 })
  return `---\n${yamlStr}---\n`
}
