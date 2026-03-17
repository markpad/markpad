import { buildClippedDocument, ClipResult } from './clipperService'

describe('clipperService', () => {
  describe('buildClippedDocument', () => {
    const fullResult: ClipResult = {
      markdown: '# Hello World\n\nThis is the article content.',
      metadata: {
        title: 'Hello World',
        author: 'John Doe',
        excerpt: 'An article about hello world',
        siteName: 'Tech Blog',
        source: 'https://example.com/article',
        clippedAt: '2026-03-17T14:30:00Z',
      },
    }

    it('should build a document with full frontmatter', () => {
      const doc = buildClippedDocument(fullResult)

      expect(doc).toContain('---')
      expect(doc).toContain('title: "Hello World"')
      expect(doc).toContain('source: https://example.com/article')
      expect(doc).toContain('author: John Doe')
      expect(doc).toContain('excerpt: "An article about hello world"')
      expect(doc).toContain('site_name: Tech Blog')
      expect(doc).toContain('clipped_at: 2026-03-17T14:30:00Z')
      expect(doc).toContain('# Hello World\n\nThis is the article content.')
    })

    it('should omit null fields from frontmatter', () => {
      const result: ClipResult = {
        markdown: '# Minimal',
        metadata: {
          title: 'Minimal',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2026-03-17T14:30:00Z',
        },
      }

      const doc = buildClippedDocument(result)

      expect(doc).toContain('title: "Minimal"')
      expect(doc).toContain('source: https://example.com')
      expect(doc).toContain('clipped_at: 2026-03-17T14:30:00Z')
      expect(doc).not.toContain('author:')
      expect(doc).not.toContain('excerpt:')
      expect(doc).not.toContain('site_name:')
    })

    it('should escape double quotes in title', () => {
      const result: ClipResult = {
        ...fullResult,
        metadata: {
          ...fullResult.metadata,
          title: 'He said "hello"',
        },
      }

      const doc = buildClippedDocument(result)
      expect(doc).toContain('title: "He said \\"hello\\""')
    })

    it('should escape double quotes in excerpt', () => {
      const result: ClipResult = {
        ...fullResult,
        metadata: {
          ...fullResult.metadata,
          excerpt: 'A "great" article',
        },
      }

      const doc = buildClippedDocument(result)
      expect(doc).toContain('excerpt: "A \\"great\\" article"')
    })

    it('should have frontmatter delimiters at start and end', () => {
      const doc = buildClippedDocument(fullResult)
      const lines = doc.split('\n')

      expect(lines[0]).toBe('---')
      // Find closing ---
      const closingIndex = lines.indexOf('---', 1)
      expect(closingIndex).toBeGreaterThan(1)
    })

    it('should have blank line between frontmatter and content', () => {
      const doc = buildClippedDocument(fullResult)

      expect(doc).toContain('---\n\n# Hello World')
    })
  })
})
