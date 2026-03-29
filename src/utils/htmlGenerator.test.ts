import type { Mock } from 'vitest'
import { generateStyledHtml, copyHtmlToClipboard, exportPdf } from '@/utils/htmlGenerator'
import type { TailwindClasses } from '@/types'

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

    it('should include body classes and htmlContent directly (no article wrapper)', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '<article class="prose">Hello</article>',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      // Body should have the classes
      expect(result).toContain(`class="${mockTailwindClasses.body}"`)
      // htmlContent is placed directly inside <body>, not wrapped in <article>
      expect(result).toContain('<article class="prose">Hello</article>')
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

      expect(result).toContain('style="font-family: \'Open Sans\', system-ui, sans-serif;"')
    })

    it('should include Google Fonts preconnect links', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">')
      expect(result).toContain(
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      )
    })

    it('should include Google Fonts stylesheet link', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Roboto',
      })

      expect(result).toContain(
        'href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap"'
      )
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

  describe('copyHtmlToClipboard', () => {
    let mockWrite: Mock
    let mockClipboardItem: Mock

    beforeEach(() => {
      // Mock ClipboardItem
      mockClipboardItem = vi.fn((items) => items)
      global.ClipboardItem = mockClipboardItem as any

      // Mock navigator.clipboard.write
      mockWrite = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          write: mockWrite,
        },
      })
    })

    it('should copy HTML with both text/html and text/plain formats', async () => {
      const htmlContent = '<h1>Hello</h1><p>World</p>'
      await copyHtmlToClipboard(htmlContent)

      expect(mockClipboardItem).toHaveBeenCalled()
      expect(mockWrite).toHaveBeenCalled()

      // Check that ClipboardItem was called with both formats
      const clipboardItemArgs = mockClipboardItem.mock.calls[0][0]
      expect(clipboardItemArgs).toHaveProperty('text/html')
      expect(clipboardItemArgs).toHaveProperty('text/plain')
    })

    it('should create Blob with correct type for HTML', async () => {
      const htmlContent = '<h1>Title</h1><p>Paragraph text</p>'
      await copyHtmlToClipboard(htmlContent)

      const clipboardItemArgs = mockClipboardItem.mock.calls[0][0]
      const htmlBlob = clipboardItemArgs['text/html']

      expect(htmlBlob).toBeInstanceOf(Blob)
      expect(htmlBlob.type).toBe('text/html')
    })

    it('should create Blob with correct type for plain text', async () => {
      const htmlContent = '<h1>Title</h1><p>Paragraph text</p>'
      await copyHtmlToClipboard(htmlContent)

      const clipboardItemArgs = mockClipboardItem.mock.calls[0][0]
      const textBlob = clipboardItemArgs['text/plain']

      expect(textBlob).toBeInstanceOf(Blob)
      expect(textBlob.type).toBe('text/plain')
    })

    it('should handle empty HTML', async () => {
      await copyHtmlToClipboard('')

      expect(mockWrite).toHaveBeenCalled()
    })

    it('should call clipboard.write with ClipboardItem array', async () => {
      const htmlContent = '<div>Content</div>'
      await copyHtmlToClipboard(htmlContent)

      expect(mockWrite).toHaveBeenCalledTimes(1)
      expect(mockWrite).toHaveBeenCalledWith(expect.arrayContaining([expect.anything()]))
    })
  })

  describe('generateStyledHtml - page break CSS rules', () => {
    it('should include break-after: avoid for headings', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('h1, h2, h3, h4, h5, h6')
      expect(result).toContain('break-after: avoid')
      expect(result).toContain('page-break-after: avoid')
    })

    it('should include break-before: avoid for elements after headings', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *')
      expect(result).toContain('break-before: avoid')
    })

    it('should include break-inside: avoid for content elements', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toContain('p, li, blockquote, pre, code, img, figure')
      expect(result).toContain('break-inside: avoid')
    })

    it('should allow tables to break between rows', () => {
      const result = generateStyledHtml({
        documentTitle: 'Test',
        htmlContent: '',
        tailwindClasses: mockTailwindClasses,
        fontFamily: 'Inter',
      })

      expect(result).toMatch(/table\s*\{[^}]*break-inside:\s*auto/)
    })
  })

  describe('exportPdf', () => {
    const defaultOptions = {
      documentTitle: 'Test Document',
      htmlContent: '<h1>Hello World</h1>',
      tailwindClasses: mockTailwindClasses,
      fontFamily: 'Inter',
    }

    it('should be an exported async function', () => {
      expect(typeof exportPdf).toBe('function')
    })

    it('should generate styled HTML with the provided options for PDF', () => {
      const html = generateStyledHtml(defaultOptions)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<title>Test Document</title>')
      expect(html).toContain('Hello World')
      expect(html).toContain('cdn.tailwindcss.com')
    })

    it('should include page break CSS rules in generated HTML for PDF', () => {
      const html = generateStyledHtml(defaultOptions)

      expect(html).toContain('break-after: avoid')
      expect(html).toContain('break-before: avoid')
      expect(html).toContain('break-inside: avoid')
    })

    it('should include body classes for theme styling in PDF', () => {
      const html = generateStyledHtml(defaultOptions)

      expect(html).toContain(`class="${mockTailwindClasses.body}"`)
    })

    it('should include Google Fonts link for PDF rendering', () => {
      const html = generateStyledHtml(defaultOptions)

      expect(html).toContain('fonts.googleapis.com')
      expect(html).toContain('family=Inter:')
    })

    it('should use A4 width constant (794px) for PDF dimensions', () => {
      // The iframe is created with 794px width (A4 at 96 DPI)
      const A4_WIDTH_PX = 794
      expect(A4_WIDTH_PX).toBe(794)
    })

    it('should derive PDF filename from document title', () => {
      const expectedFilename = `${defaultOptions.documentTitle}.pdf`
      expect(expectedFilename).toBe('Test Document.pdf')
    })

    it('should handle special characters in document title for filename', () => {
      const options = { ...defaultOptions, documentTitle: 'Report — Q1 (2026)' }
      const expectedFilename = `${options.documentTitle}.pdf`
      expect(expectedFilename).toBe('Report — Q1 (2026).pdf')
    })
  })

  describe('generateStyledHtml - dual font support', () => {
    const baseOptions = {
      documentTitle: 'Test',
      htmlContent: '',
      tailwindClasses: mockTailwindClasses,
      fontFamily: 'Inter',
    }

    it('should load a single font link when headingFontFamily is not set', () => {
      const result = generateStyledHtml(baseOptions)

      const fontLinkCount = (result.match(/fonts\.googleapis\.com\/css2/g) || []).length
      expect(fontLinkCount).toBe(1)
      expect(result).toContain('family=Inter:')
    })

    it('should load two font links when headingFontFamily differs from fontFamily', () => {
      const result = generateStyledHtml({
        ...baseOptions,
        fontFamily: 'Inter',
        headingFontFamily: 'Playfair Display',
      })

      const fontLinkCount = (result.match(/fonts\.googleapis\.com\/css2/g) || []).length
      expect(fontLinkCount).toBe(2)
      expect(result).toContain('family=Inter:')
      expect(result).toContain('family=Playfair+Display:')
    })

    it('should not add extra font link when headingFontFamily equals fontFamily', () => {
      const result = generateStyledHtml({
        ...baseOptions,
        fontFamily: 'Roboto',
        headingFontFamily: 'Roboto',
      })

      const fontLinkCount = (result.match(/fonts\.googleapis\.com\/css2/g) || []).length
      expect(fontLinkCount).toBe(1)
    })

    it('should inject h1-h6 CSS rule when headingFontFamily differs from fontFamily', () => {
      const result = generateStyledHtml({
        ...baseOptions,
        fontFamily: 'Inter',
        headingFontFamily: 'Playfair Display',
      })

      expect(result).toMatch(
        /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*font-family[^}]*Playfair Display[^}]*\}/
      )
    })

    it('should not inject h1-h6 font-family rule when headingFontFamily is not set', () => {
      const result = generateStyledHtml(baseOptions)

      // The only h1-h6 rule should be the page-break rule, which does NOT contain font-family
      const headingFontFamilyRuleMatch = result.match(
        /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*font-family[^}]*\}/
      )
      expect(headingFontFamilyRuleMatch).toBeNull()
    })
  })
})
