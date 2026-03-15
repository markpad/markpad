/**
 * Types for the markdown templating engine
 */

/**
 * Result from parsing frontmatter
 */
export interface ParseResult {
  /** The markdown content without frontmatter */
  content: string
  /** The frontmatter data as an object */
  frontmatter: Record<string, unknown>
  /** The original markdown including frontmatter */
  raw: string
}

/**
 * Options for processing templates
 */
export interface ProcessOptions {
  /** Custom variables to merge with frontmatter data */
  variables?: Record<string, unknown>
}

/**
 * Result from processing a template
 */
export interface ProcessResult {
  /** The processed content with all templates resolved */
  content: string
  /** The frontmatter data used */
  frontmatter: Record<string, unknown>
  /** The original raw markdown */
  raw: string
}

/**
 * Loop metadata available inside {% for %} blocks
 */
export interface LoopContext {
  /** 1-based index */
  index: number
  /** 0-based index */
  index0: number
  /** True if first iteration */
  first: boolean
  /** True if last iteration */
  last: boolean
  /** Total number of items in the array */
  length: number
}
