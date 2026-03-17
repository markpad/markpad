export interface ClipMetadata {
  title: string
  author: string | null
  excerpt: string | null
  siteName: string | null
  source: string
  clippedAt: string
}

export interface ClipResult {
  markdown: string
  metadata: ClipMetadata
}

const WORKER_URL =
  process.env.REACT_APP_CLIPPER_URL || 'https://markpad-worker.josetelesmaciel.workers.dev'

/**
 * Error response from the worker (RFC 7807 ProblemDetail).
 */
interface ProblemDetail {
  type: string
  title: string
  status: number
  detail?: string
  code: string
  timestamp: string
}

/**
 * Clip an article from a URL using the Markpad Web Clipper worker.
 * Returns the article content as markdown with metadata.
 */
export async function clipFromUrl(url: string): Promise<ClipResult> {
  const response = await fetch(`${WORKER_URL}/clip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const data = await response.json()

  if (!response.ok) {
    const problem = data as ProblemDetail
    throw new Error(
      problem.detail || problem.title || `Failed to clip URL (HTTP ${response.status})`
    )
  }

  return data as ClipResult
}

/**
 * Generate a markdown document with frontmatter from clip result.
 */
export function buildClippedDocument(result: ClipResult): string {
  const { metadata, markdown } = result

  const frontmatter = [
    '---',
    `title: "${metadata.title.replace(/"/g, '\\"')}"`,
    `source: ${metadata.source}`,
  ]

  if (metadata.author) {
    frontmatter.push(`author: ${metadata.author}`)
  }

  if (metadata.excerpt) {
    frontmatter.push(`excerpt: "${metadata.excerpt.replace(/"/g, '\\"')}"`)
  }

  if (metadata.siteName) {
    frontmatter.push(`site_name: ${metadata.siteName}`)
  }

  frontmatter.push(`clipped_at: ${metadata.clippedAt}`)
  frontmatter.push('---')

  return `${frontmatter.join('\n')}\n\n${markdown}`
}
