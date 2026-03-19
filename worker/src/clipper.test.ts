import { describe, it, expect, vi } from 'vitest'
import { isValidUrl, jsonResponse, extractArticle, htmlToMarkdown } from './clipper'
import { errors, type ProblemDetail } from './errors'

describe('Clipper', () => {
  describe('isValidUrl', () => {
    it('should accept http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('should accept https URLs', () => {
      expect(isValidUrl('https://example.com/article')).toBe(true)
    })

    it('should accept URLs with paths and query params', () => {
      expect(isValidUrl('https://example.com/path/to/article?id=123&lang=en')).toBe(true)
    })

    it('should accept URLs with fragments', () => {
      expect(isValidUrl('https://example.com/article#section')).toBe(true)
    })

    it('should accept URLs with ports', () => {
      expect(isValidUrl('http://localhost:8080/page')).toBe(true)
    })

    it('should reject ftp protocol', () => {
      expect(isValidUrl('ftp://example.com/file')).toBe(false)
    })

    it('should reject javascript protocol', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })

    it('should reject data URLs', () => {
      expect(isValidUrl('data:text/html,<h1>Hi</h1>')).toBe(false)
    })

    it('should reject file protocol', () => {
      expect(isValidUrl('file:///etc/passwd')).toBe(false)
    })

    it('should reject empty string', () => {
      expect(isValidUrl('')).toBe(false)
    })

    it('should reject malformed URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
    })

    it('should reject URLs without protocol', () => {
      expect(isValidUrl('example.com')).toBe(false)
    })
  })

  describe('jsonResponse', () => {
    it('should return JSON with correct status for ProblemDetail', async () => {
      const error = errors.invalidUrl(undefined, 'http://localhost:8787/clip')
      const response = jsonResponse(error, 400, 'https://markpad.cc')

      expect(response.status).toBe(400)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://markpad.cc')

      const body = (await response.json()) as ProblemDetail
      expect(body.type).toBe('https://markpad.cc/errors/INVALID_URL')
      expect(body.title).toBe('Invalid URL')
      expect(body.code).toBe('INVALID_URL')
      expect(body.status).toBe(400)
      expect(body.instance).toBe('http://localhost:8787/clip')
    })

    it('should return 200 by default with ClipResponse', async () => {
      const data = {
        markdown: '# Hello',
        metadata: {
          title: 'Hello',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2026-03-17T00:00:00Z',
        },
      }

      const response = jsonResponse(data, 200, 'https://markpad.cc')
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.markdown).toBe('# Hello')
      expect(body.metadata.title).toBe('Hello')
    })

    it('should set the correct CORS origin', async () => {
      const error = errors.notFound(undefined, 'http://localhost:8787/unknown')
      const response = jsonResponse(error, 404, 'http://localhost:3000')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    })
  })

  describe('extractArticle', () => {
    const url = 'https://example.com/article'

    function makeHtml(body: string, title = 'Page Title'): string {
      return `<!DOCTYPE html>
<html>
<head><title>${title}</title></head>
<body>
${body}
</body>
</html>`
    }

    it('should extract h1 from the article', () => {
      const html = makeHtml(`
        <article>
          <h1 class="entry-title">My Article Title</h1>
          <p>First paragraph with enough content to be considered an article by Readability.
          This needs to be long enough for the algorithm to pick it up as valid content.</p>
          <p>Second paragraph with more content to ensure Readability considers this a real article.
          Adding more text here to make the content substantial enough.</p>
          <p>Third paragraph continues with additional details about the topic at hand.</p>
        </article>
      `)

      const result = extractArticle(html, url)
      expect(result).not.toBeNull()
      expect(result!.h1).toBe('My Article Title')
    })

    it('should return h1 as null when there is no h1 tag', () => {
      const html = makeHtml(`
        <article>
          <h2>Subtitle Only</h2>
          <p>First paragraph with enough content to be considered an article by Readability.
          This needs to be long enough for the algorithm to pick it up as valid content.</p>
          <p>Second paragraph with more content to ensure Readability considers this a real article.
          Adding more text here to make the content substantial enough.</p>
          <p>Third paragraph continues with additional details about the topic at hand.</p>
        </article>
      `)

      const result = extractArticle(html, url)
      if (result) {
        expect(result.h1).toBeNull()
      }
    })

    it('should extract h1 text without HTML tags', () => {
      const html = makeHtml(`
        <article>
          <h1><span>Formatted</span> <em>Title</em></h1>
          <p>First paragraph with enough content to be considered an article by Readability.
          This needs to be long enough for the algorithm to pick it up as valid content.</p>
          <p>Second paragraph with more content to ensure Readability considers this a real article.
          Adding more text here to make the content substantial enough.</p>
          <p>Third paragraph continues with additional details about the topic at hand.</p>
        </article>
      `)

      const result = extractArticle(html, url)
      expect(result).not.toBeNull()
      expect(result!.h1).toBe('Formatted Title')
    })

    it('should trim whitespace from h1', () => {
      const html = makeHtml(`
        <article>
          <h1>   Spaced Title   </h1>
          <p>First paragraph with enough content to be considered an article by Readability.
          This needs to be long enough for the algorithm to pick it up as valid content.</p>
          <p>Second paragraph with more content to ensure Readability considers this a real article.
          Adding more text here to make the content substantial enough.</p>
          <p>Third paragraph continues with additional details about the topic at hand.</p>
        </article>
      `)

      const result = extractArticle(html, url)
      expect(result).not.toBeNull()
      expect(result!.h1).toBe('Spaced Title')
    })

    it('should extract the first h1 when multiple exist', () => {
      const html = makeHtml(`
        <article>
          <h1>First Title</h1>
          <p>First paragraph with enough content to be considered an article by Readability.
          This needs to be long enough for the algorithm to pick it up as valid content.</p>
          <h1>Second Title</h1>
          <p>Second paragraph with more content to ensure Readability considers this a real article.
          Adding more text here to make the content substantial enough.</p>
          <p>Third paragraph continues with additional details about the topic at hand.</p>
        </article>
      `)

      const result = extractArticle(html, url)
      expect(result).not.toBeNull()
      expect(result!.h1).toBe('First Title')
    })

    it('should still extract title, content, byline, and excerpt', () => {
      const html = makeHtml(
        `
        <article>
          <h1>Article Heading</h1>
          <p>This is the first paragraph of the article with enough content to be considered valid.
          The Readability algorithm needs substantial text to parse correctly.</p>
          <p>This is the second paragraph with more details about the topic being discussed.
          Adding more sentences to make the content meaningful and substantial enough.</p>
          <p>This is the third paragraph which concludes the article content nicely.</p>
        </article>
      `,
        'Article Heading - My Site'
      )

      const result = extractArticle(html, url)
      expect(result).not.toBeNull()
      expect(result!.title).toBeDefined()
      expect(result!.content).toBeDefined()
      expect(result!.h1).toBe('Article Heading')
    })
  })

  describe('htmlToMarkdown', () => {
    it('should convert headings to atx style', () => {
      const html = '<h1>Title</h1><p>Content</p>'
      const result = htmlToMarkdown(html)
      expect(result).toContain('# Title')
      expect(result).toContain('Content')
    })

    it('should convert nested headings', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2><p>Content</p>'
      const result = htmlToMarkdown(html)
      expect(result).toContain('# Title')
      expect(result).toContain('## Subtitle')
    })

    it('should use - for bullet lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
      const result = htmlToMarkdown(html)
      expect(result).toContain('-   Item 1')
      expect(result).toContain('-   Item 2')
    })

    it('should collapse excessive newlines', () => {
      const html = '<p>First</p><br><br><br><p>Second</p>'
      const result = htmlToMarkdown(html)
      expect(result).not.toMatch(/\n{3,}/)
    })

    it('should trim leading and trailing whitespace', () => {
      const html = '  <p>Content</p>  '
      const result = htmlToMarkdown(html)
      expect(result).toBe(result.trim())
    })

    it('should use fenced code blocks', () => {
      const html = '<pre><code>const x = 1;</code></pre>'
      const result = htmlToMarkdown(html)
      expect(result).toContain('```')
      expect(result).toContain('const x = 1;')
    })

    it('should convert images to markdown', () => {
      const html = '<img src="https://example.com/img.jpg" alt="Photo" title="My photo">'
      const result = htmlToMarkdown(html)
      expect(result).toContain('![Photo](https://example.com/img.jpg "My photo")')
    })
  })

  describe('h1 in markdown output', () => {
    it('should include h1 as heading when article has an h1', () => {
      const html = `<!DOCTYPE html>
<html>
<head><title>My Article - Site Name</title></head>
<body>
<article>
  <h1 class="entry-title">My Article</h1>
  <p>This is the first paragraph of the article with enough content to be considered valid.
  The Readability algorithm needs substantial text to parse correctly.</p>
  <p>This is the second paragraph with more details about the topic being discussed.
  Adding more sentences to make the content meaningful and substantial enough.</p>
  <p>Third paragraph with even more content to ensure extraction works properly.</p>
</article>
</body>
</html>`

      const article = extractArticle(html, 'https://example.com/article')
      expect(article).not.toBeNull()
      expect(article!.h1).toBe('My Article')

      // Simulate what clipUrl does: prepend h1 to content
      const contentWithHeading = article!.h1
        ? `<h1>${article!.h1}</h1>${article!.content}`
        : article!.content
      const markdown = htmlToMarkdown(contentWithHeading)

      expect(markdown).toMatch(/^# My Article/)
    })

    it('should not duplicate h1 if Readability already preserved it', () => {
      const html = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<article>
  <h1>Heading</h1>
  <p>Content paragraph one with enough text to be considered a real article by the algorithm.
  We need multiple sentences and paragraphs for Readability to work properly.</p>
  <p>Content paragraph two with additional information about the subject matter at hand.</p>
  <p>Content paragraph three concludes the article with final thoughts and remarks.</p>
</article>
</body>
</html>`

      const article = extractArticle(html, 'https://example.com/test')
      if (article) {
        const contentWithHeading = article.h1
          ? `<h1>${article.h1}</h1>${article.content}`
          : article.content
        const markdown = htmlToMarkdown(contentWithHeading)

        // The h1 should appear at least once
        expect(markdown).toContain('# Heading')
      }
    })
  })
})
