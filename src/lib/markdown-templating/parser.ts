import yaml from 'js-yaml'
import type { ParseResult } from './types'

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
  // Match frontmatter block: starts with ---, ends with ---
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return {
      content: markdown,
      frontmatter: {},
      raw: markdown,
    }
  }

  const yamlContent = match[1]
  const content = markdown.slice(match[0].length)

  try {
    const data = yaml.load(yamlContent) as Record<string, unknown>
    return {
      content,
      frontmatter: data || {},
      raw: markdown,
    }
  } catch {
    // If YAML parsing fails, return original content with empty data
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
  const yamlString = yaml.dump(data, { indent: 2, lineWidth: -1 })
  return `---\n${yamlString}---\n`
}
