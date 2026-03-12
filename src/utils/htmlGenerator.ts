import type { TailwindClasses } from '../types'

interface HtmlGeneratorOptions {
  documentTitle: string
  htmlContent: string
  tailwindClasses: TailwindClasses
  fontFamily: string
}

/**
 * Generate a simple HTML document without any styling
 */
export function generateSimpleHtml({
  documentTitle,
  htmlContent,
}: Pick<HtmlGeneratorOptions, 'documentTitle' | 'htmlContent'>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
</head>
<body>
  <article>
${htmlContent}
  </article>
</body>
</html>`
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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <script src="${tailwindCdn}"></script>
  <style>
    body { font-family: ${fontFamily}, system-ui, sans-serif; }
  </style>
</head>
<body class="${tailwindClasses.body}" style="font-family: ${fontFamily}, system-ui, sans-serif;">
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
 * Copy content to clipboard
 */
export async function copyToClipboard(content: string): Promise<void> {
  await navigator.clipboard.writeText(content)
}
