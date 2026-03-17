import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'
import TurndownService from 'turndown'
import type { ClipRequest, ClipResponse } from './types'
import { errors, type ProblemDetail } from './errors'

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

class FetchError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

class ContentTypeError extends Error {
  constructor(public contentType: string) {
    super(`Unsupported content type: ${contentType}`)
    this.name = 'ContentTypeError'
  }
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Markpad/1.0; +https://markpad.cc)',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new FetchError(response.status, `Failed to fetch URL: HTTP ${response.status}`)
  }

  const contentType = response.headers.get('Content-Type') || ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new ContentTypeError(contentType)
  }

  return response.text()
}

function extractArticle(
  html: string,
  url: string
): {
  title: string
  content: string
  byline: string | null
  excerpt: string | null
  siteName: string | null
} | null {
  const { document } = parseHTML(html)

  // Set the document URL for Readability to resolve relative URLs
  // linkedom doesn't support setting documentURI directly, so we use a base tag
  const base = document.createElement('base')
  base.setAttribute('href', url)
  document.head.appendChild(base)

  const reader = new Readability(document)
  return reader.parse()
}

function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  })

  // Parse HTML with linkedom since Workers don't have DOMParser
  const { document } = parseHTML(html)
  const markdown = turndown.turndown(document as unknown as HTMLElement)

  return markdown
    .replace(/\n{3,}/g, '\n\n') // Collapse 3+ newlines to 2
    .trim()
}

export function jsonResponse(
  data: ClipResponse | ProblemDetail,
  status: number,
  origin: string
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
    },
  })
}

function errorResponse(error: ProblemDetail, origin: string): Response {
  return jsonResponse(error, error.status, origin)
}

export async function clipUrl(request: Request, origin: string): Promise<Response> {
  const requestUrl = request.url
  let body: ClipRequest

  try {
    body = await request.json<ClipRequest>()
  } catch (error) {
    const detail = error instanceof Error ? error.message : undefined
    return errorResponse(errors.invalidJson(detail, requestUrl), origin)
  }

  const { url } = body

  if (!url || typeof url !== 'string') {
    return errorResponse(errors.missingUrl(requestUrl), origin)
  }

  if (!isValidUrl(url)) {
    return errorResponse(errors.invalidUrl(undefined, requestUrl), origin)
  }

  let html: string
  try {
    html = await fetchHtml(url)
  } catch (error) {
    if (error instanceof FetchError) {
      return errorResponse(errors.fetchFailed(error.statusCode, error.message, requestUrl), origin)
    }
    if (error instanceof ContentTypeError) {
      return errorResponse(errors.unsupportedContentType(error.contentType, requestUrl), origin)
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch URL'
    return errorResponse(errors.internalError(message, requestUrl), origin)
  }

  let article: {
    title: string
    content: string
    byline: string | null
    excerpt: string | null
    siteName: string | null
  } | null

  try {
    article = extractArticle(html, url)
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined
    return errorResponse(errors.parseError(message, requestUrl), origin)
  }

  if (!article) {
    return errorResponse(errors.extractionFailed(undefined, requestUrl), origin)
  }

  let markdown: string
  try {
    markdown = htmlToMarkdown(article.content)
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined
    return errorResponse(errors.parseError(message, requestUrl), origin)
  }

  const response: ClipResponse = {
    markdown,
    metadata: {
      title: article.title || '',
      author: article.byline,
      excerpt: article.excerpt,
      siteName: article.siteName,
      source: url,
      clippedAt: new Date().toISOString(),
    },
  }

  return jsonResponse(response, 200, origin)
}
