/**
 * Frontmatter utilities - Re-exports from markdown-templating lib
 *
 * This file wraps the markdown-templating lib to maintain backward compatibility
 * with the existing API used throughout the codebase.
 *
 * @see src/lib/markdown-templating for the core implementation
 */

import {
  parse,
  serialize,
  process,
  interpolate,
  processConditionals as processConditionalsLib,
  processLoops as processLoopsLib,
  evaluateCondition,
  extractArrayVariables as extractArrayVariablesLib,
  generateLoopTemplate as generateLoopTemplateLib,
  generateIfTemplate as generateIfTemplateLib,
} from '@/lib/markdown-templating'

// Re-export types with backward-compatible names
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
 * @param markdown - The markdown string potentially containing frontmatter
 * @returns Object with parsed content, data, and original markdown
 */
export function parseFrontmatter(markdown: string): FrontmatterResult {
  const result = parse(markdown)
  return {
    content: result.content,
    data: result.frontmatter,
    original: result.raw,
  }
}

/**
 * Interpolate variables in markdown content using frontmatter data
 * @param content - The markdown content with variable placeholders
 * @param data - The frontmatter data object
 * @returns The content with variables replaced by their values
 */
export function interpolateVariables(content: string, data: Record<string, unknown>): string {
  return interpolate(content, data, true)
}

/**
 * Process markdown with frontmatter support
 * @param markdown - The markdown string with optional frontmatter
 * @returns Object with processed content and original markdown
 */
export function processMarkdownWithFrontmatter(markdown: string): {
  processedContent: string
  originalMarkdown: string
  frontmatterData: Record<string, unknown>
} {
  const result = process(markdown)
  return {
    processedContent: result.content,
    originalMarkdown: result.raw,
    frontmatterData: result.frontmatter,
  }
}

/**
 * Evaluate a condition expression against frontmatter data
 */
export { evaluateCondition }

/**
 * Process conditionals in content using Liquid-like syntax
 */
export function processConditionals(content: string, data: Record<string, unknown>): string {
  return processConditionalsLib(content, data)
}

/**
 * Generate an if template string
 */
export function generateIfTemplate(
  variable: string,
  content: string,
  elseContent?: string
): string {
  return generateIfTemplateLib(variable, content, elseContent)
}

/**
 * Process loops in content using Liquid-like syntax
 */
export function processLoops(content: string, data: Record<string, unknown>): string {
  return processLoopsLib(content, data)
}

/**
 * Extract array variables from frontmatter data
 */
export function extractArrayVariables(data: Record<string, unknown>): string[] {
  return extractArrayVariablesLib(data)
}

/**
 * Generate a loop template string
 */
export function generateLoopTemplate(
  arrayName: string,
  iteratorName = 'item',
  template?: string
): string {
  return generateLoopTemplateLib(arrayName, iteratorName, template)
}

/**
 * Add or update an array in frontmatter
 */
export function addArrayToFrontmatter(
  markdown: string,
  arrayName: string,
  items: string[]
): string {
  const { content, frontmatter } = parse(markdown)
  frontmatter[arrayName] = items
  return serialize(frontmatter) + content
}
