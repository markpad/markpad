import type { TailwindClasses } from '../types'

interface HtmlGeneratorOptions {
  documentTitle: string
  htmlContent: string
  tailwindClasses: TailwindClasses
  fontFamily: string
}

/**
 * Convert font family name to Google Fonts URL
 */
function getFontUrl(fontFamily: string): string {
  // Extract the main font name (before any fallbacks)
  const mainFont = fontFamily.split(',')[0].trim().replace(/["']/g, '')
  // Convert font name to URL format (replace spaces with +)
  const urlFormattedFont = mainFont.replace(/\s+/g, '+')
  return `https://fonts.googleapis.com/css2?family=${urlFormattedFont}:wght@400;500;600;700&display=swap`
}

/**
 * Generate a styled HTML document with Tailwind CSS
 */
export function generateStyledHtml({
  documentTitle,
  htmlContent,
  tailwindClasses,
  fontFamily,
}: HtmlGeneratorOptions): string {
  const tailwindCdn = 'https://cdn.tailwindcss.com'
  const fontUrl = getFontUrl(fontFamily)
  // Extract main font name for CSS
  const mainFontName = fontFamily.split(',')[0].trim().replace(/["']/g, '')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <script src="${tailwindCdn}"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    body { font-family: '${mainFontName}', system-ui, sans-serif; }
  </style>
</head>
<body class="${tailwindClasses.body}" style="font-family: '${mainFontName}', system-ui, sans-serif;">
  <article class="${tailwindClasses.article}">
${htmlContent}
  </article>
</body>
</html>`
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Copy content to clipboard as plain text
 */
export async function copyToClipboard(content: string): Promise<void> {
  await navigator.clipboard.writeText(content)
}

/**
 * Copy HTML content to clipboard with rich formatting
 * This allows pasting formatted content into rich text editors
 */
export async function copyHtmlToClipboard(htmlContent: string): Promise<void> {
  // Extract text content from HTML for plain text fallback
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  const textContent = tempDiv.textContent || tempDiv.innerText || ''

  // Create clipboard item with both HTML and plain text
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const textBlob = new Blob([textContent], { type: 'text/plain' })

  const clipboardItem = new ClipboardItem({
    'text/html': blob,
    'text/plain': textBlob,
  })

  await navigator.clipboard.write([clipboardItem])
}
