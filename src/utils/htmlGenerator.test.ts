import { generateStyledHtml } from './htmlGenerator'
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
      expect(result).toContain("font-family: 'Roboto', system-ui, sans-serif;")
    })

    it('should include font-family inline style on body', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Open Sans',
      })

      expect(result).toContain("style=\"font-family: 'Open Sans', system-ui, sans-serif;\"")
    })

    it('should include Google Fonts preconnect links', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">')
      expect(result).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    })

    it('should include Google Fonts stylesheet link', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Roboto',
      })

      expect(result).toContain('href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap"')
    })

    it('should handle font names with spaces in Google Fonts URL', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Open Sans',
      })

      expect(result).toContain('family=Open+Sans:')
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
})
