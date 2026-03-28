import type { TailwindClasses } from '@/types'

export interface HtmlGeneratorOptions {
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
    html, body { min-height: 100%; height: 100%; }
    body { font-family: '${mainFontName}', system-ui, sans-serif; }
    /* Prevent page breaks inside elements */
    h1, h2, h3, h4, h5, h6 {
      break-after: avoid; page-break-after: avoid;
      break-inside: avoid; page-break-inside: avoid;
    }
    /* Prevent break between a heading and the content right after it */
    h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + * {
      break-before: avoid; page-break-before: avoid;
    }
    p, li, blockquote, pre, code, img, figure {
      break-inside: avoid; page-break-inside: avoid;
    }
    table { break-inside: auto; page-break-inside: auto; }
    tr { break-inside: avoid; page-break-inside: avoid; }
  </style>
</head>
<body class="${tailwindClasses.body}" style="font-family: '${mainFontName}', system-ui, sans-serif;">
${htmlContent}
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

/**
 * Generate a PDF from the styled HTML document and trigger a download.
 * Uses html2pdf.js (html2canvas + jsPDF) for accurate rendering
 * that preserves backgrounds, colors, and fonts.
 *
 * Strategy:
 * 1. Render in a hidden iframe so Tailwind CDN and Google Fonts load and process
 * 2. Extract CSS and content from iframe
 * 3. Place content in a Shadow DOM container (styles isolated from main UI)
 * 4. Capture with html2canvas from the shadow container
 */
export async function exportPdf(options: HtmlGeneratorOptions): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default

  const styledHtml = generateStyledHtml(options)

  // Step 1: Render in iframe to let Tailwind CDN process classes
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.left = '-10000px'
  iframe.style.top = '0'
  iframe.style.width = '794px'
  iframe.style.height = '1123px'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  // Use srcdoc + onload for reliable loading
  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve()
    iframe.srcdoc = styledHtml
  })

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
  if (!iframeDoc || !iframe.contentWindow) {
    document.body.removeChild(iframe)
    return
  }

  // Poll until Tailwind CDN has generated styles (or timeout after 10s)
  await new Promise<void>((resolve) => {
    let resolved = false
    const done = () => {
      if (!resolved) {
        resolved = true
        resolve()
      }
    }
    const check = () => {
      const styles = iframeDoc.querySelectorAll('style')
      if (styles.length > 1) {
        done()
        return
      }
      setTimeout(check, 200)
    }
    setTimeout(check, 500)
    setTimeout(done, 10000)
  })

  // Small extra wait to let Tailwind finish processing
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Step 2: Extract CSS and content from iframe
  let extractedCss = ''
  iframeDoc.querySelectorAll('style').forEach((style) => {
    extractedCss += style.textContent + '\n'
  })

  const bodyClass = iframeDoc.body.className
  const bodyStyle = iframeDoc.body.getAttribute('style') || ''
  const bodyHtml = iframeDoc.body.innerHTML
  const computedBg = iframe.contentWindow.getComputedStyle(iframeDoc.body).backgroundColor

  // Done with iframe
  document.body.removeChild(iframe)

  // Step 3: Create a host element with Shadow DOM to isolate styles
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '0'
  host.style.top = '0'
  host.style.width = '794px'
  host.style.zIndex = '-9999'
  host.style.pointerEvents = 'none'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  // Inject extracted CSS inside the shadow (won't leak to main document)
  const styleEl = document.createElement('style')
  styleEl.textContent = extractedCss
  shadow.appendChild(styleEl)

  // Create the content container inside shadow
  const container = document.createElement('div')
  container.className = bodyClass
  container.setAttribute('style', `width:794px;${bodyStyle}`)
  container.innerHTML = bodyHtml
  shadow.appendChild(container)

  // Let the browser lay out
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Force height to fill last page
  const A4_PAGE_HEIGHT = 1123
  const contentHeight = container.scrollHeight
  const pages = Math.max(1, Math.ceil((contentHeight - 1) / A4_PAGE_HEIGHT))
  const targetHeight = pages * A4_PAGE_HEIGHT - 1
  container.style.minHeight = `${targetHeight}px`
  host.style.height = `${targetHeight}px`

  try {
    const bgColor =
      computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent'
        ? computedBg
        : '#ffffff'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfOptions: any = {
      margin: [0, 0, 0, 0],
      filename: `${options.documentTitle}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: 794,
        backgroundColor: bgColor,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] },
    }

    await html2pdf().set(pdfOptions).from(container).save()
  } finally {
    document.body.removeChild(host)
  }
}
