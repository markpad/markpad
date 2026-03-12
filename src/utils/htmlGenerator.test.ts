import { generateSimpleHtml, generateStyledHtml } from './htmlGenerator'
import type { TailwindClasses } from '../types'

describe('htmlGenerator module', () => {
  const mockTailwindClasses: TailwindClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base',
    p: 'text-base leading-relaxed',
    a: 'text-blue-600 hover:underline',
    img: 'max-w-full',
    table: 'w-full border-collapse',
    ul: 'list-disc pl-5',
    ol: 'list-decimal pl-5',
    li: 'mb-1',
    strong: 'font-bold',
    em: 'italic',
    tr: 'border-b',
    td: 'p-2',
    th: 'p-2 font-bold',
    blockquote: 'border-l-4 pl-4 italic',
    code: 'bg-gray-100 px-1 rounded',
    pre: 'bg-gray-100 p-4 rounded',
    body: 'bg-white text-gray-900',
    article: 'max-w-4xl mx-auto p-8',
  }

  describe('generateSimpleHtml', () => {
    it('should generate valid HTML document structure', () => {
      const result = generateSimpleHtml({
        documentTitle: 'Test Document',
        htmlContent: '<h1>Hello World</h1>',
      })

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<html lang="en">')
      expect(result).toContain('</html>')
    })

    it('should include the document title in the title tag', () => {
      const result = generateSimpleHtml({
        documentTitle: 'My Test Title',
        htmlContent: '<p>Content</p>',
      })

      expect(result).toContain('<title>My Test Title</title>')
    })

    it('should wrap content in article tag', () => {
      const result = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Test content</p>',
      })

      expect(result).toContain('<article>')
      expect(result).toContain('<p>Test content</p>')
      expect(result).toContain('</article>')
    })

    it('should include meta viewport tag', () => {
      const result = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '',
      })

      expect(result).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      )
    })

    it('should include charset meta tag', () => {
      const result = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '',
      })

      expect(result).toContain('<meta charset="UTF-8">')
    })

    it('should not include any styling', () => {
      const result = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Content</p>',
      })

      expect(result).not.toContain('tailwindcss')
      expect(result).not.toContain('<style>')
      expect(result).not.toContain('class=')
    })
  })

  describe('generateStyledHtml', () => {
    it('should generate valid HTML document structure', () => {
      const result = generateStyledHtml({
        documentTitle: 'Styled Document',
        htmlContent: '<h1>Hello World</h1>',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<html lang="en">')
      expect(result).toContain('</html>')
    })

    it('should include Tailwind CSS CDN script', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('<script src="https://cdn.tailwindcss.com"></script>')
    })

    it('should apply body classes from tailwindClasses', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain(`class="${mockTailwindClasses.body}"`)
    })

    it('should apply article classes from tailwindClasses', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain(`<article class="${mockTailwindClasses.article}">`)
    })

    it('should include font-family in style tag', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Roboto',
      })

      expect(result).toContain('<style>')
      expect(result).toContain('font-family: Roboto, system-ui, sans-serif;')
    })

    it('should include font-family inline style on body', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Open Sans',
      })

      expect(result).toContain('style="font-family: Open Sans, system-ui, sans-serif;"')
    })

    it('should include the document title', () => {
      const result = generateStyledHtml({
        documentTitle: 'My Styled Document',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('<title>My Styled Document</title>')
    })

    it('should include the html content', () => {
      const htmlContent = '<h1 class="text-4xl">Hello</h1><p>World</p>'
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent,
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain(htmlContent)
    })
  })

  describe('comparison between simple and styled', () => {
    it('simple HTML should be smaller than styled HTML', () => {
      const simple = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Content</p>',
      })

      const styled = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Content</p>',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(simple.length).toBeLessThan(styled.length)
    })

    it('both should have the same basic structure', () => {
      const simple = generateSimpleHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Content</p>',
      })

      const styled = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '<p>Content</p>',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      // Both should be valid HTML5 documents
      expect(simple).toContain('<!DOCTYPE html>')
      expect(styled).toContain('<!DOCTYPE html>')

      // Both should have the content
      expect(simple).toContain('<p>Content</p>')
      expect(styled).toContain('<p>Content</p>')
    })
  })
})
