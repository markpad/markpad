import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'
import TurndownService from 'turndown'
import type { ClipRequest, ClipResponse, ClipErrorResponse } from './types'

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
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
    throw new Error(`Failed to fetch URL: HTTP ${response.status}`)
  }

  const contentType = response.headers.get('Content-Type') || ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new Error('URL did not return HTML content')
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
  data: ClipResponse | ClipErrorResponse,
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

export async function clipUrl(request: Request, origin: string): Promise<Response> {
  let body: ClipRequest

  try {
    body = await request.json<ClipRequest>()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, origin)
  }

  const { url } = body

  if (!url || typeof url !== 'string') {
    return jsonResponse({ error: 'Missing required field: url' }, 400, origin)
  }

  if (!isValidUrl(url)) {
    return jsonResponse(
      { error: 'Invalid URL. Only http and https protocols are supported.' },
      400,
      origin
    )
  }

  let html: string
  try {
    html = await fetchHtml(url)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch URL'
    return jsonResponse({ error: message }, 502, origin)
  }

  const article = extractArticle(html, url)

  if (!article) {
    return jsonResponse({ error: 'Could not extract readable content from this URL' }, 422, origin)
  }

  const markdown = htmlToMarkdown(article.content)

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
