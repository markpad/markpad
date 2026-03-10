import { FaTimes, FaDownload, FaMarkdown, FaCode, FaFileCode } from 'react-icons/fa'
import type { TailwindClasses } from '../types'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  documentTitle: string
  markdown: string
  htmlContent: string
  tailwindClasses: TailwindClasses
  fontFamily: string
}

/**
 * Modal for downloading document in different formats
 */
export function DownloadModal({
  isOpen,
  onClose,
  documentTitle,
  markdown,
  htmlContent,
  tailwindClasses,
  fontFamily,
}: DownloadModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onClose()
  }

  const handleDownloadMarkdown = () => {
    downloadFile(markdown, `${documentTitle}.md`, 'text/markdown')
  }

  const handleDownloadSimpleHtml = () => {
    const simpleHtml = `<!DOCTYPE html>
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
    downloadFile(simpleHtml, `${documentTitle}.html`, 'text/html')
  }

  const handleDownloadCompleteHtml = () => {
    const tailwindCdn = 'https://cdn.tailwindcss.com'
    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <script src="${tailwindCdn}"></script>
  <style>
    body {
      font-family: ${fontFamily}, system-ui, sans-serif;
    }
    /* Tailwind Classes Applied */
    .body-styles { ${tailwindClasses.body ? `@apply ${tailwindClasses.body};` : ''} }
    .article-styles { ${tailwindClasses.article ? `@apply ${tailwindClasses.article};` : ''} }
  </style>
</head>
<body class="${tailwindClasses.body}" style="font-family: ${fontFamily}, system-ui, sans-serif;">
  <article class="${tailwindClasses.article}">
${htmlContent}
  </article>
</body>
</html>`
    downloadFile(completeHtml, `${documentTitle}-styled.html`, 'text/html')
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaDownload className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Download Document</h2>
              <p className="text-sm text-gray-500">Choose your preferred format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Markdown Option */}
          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
              <FaMarkdown className="text-gray-600 group-hover:text-blue-600 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900">Markdown</p>
              <p className="text-sm text-gray-500">Original source file (.md)</p>
            </div>
          </button>

          {/* Simple HTML Option */}
          <button
            onClick={handleDownloadSimpleHtml}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
              <FaCode className="text-gray-600 group-hover:text-blue-600 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900">Simple HTML</p>
              <p className="text-sm text-gray-500">Plain HTML without styles (.html)</p>
            </div>
          </button>

          {/* Complete HTML Option */}
          <button
            onClick={handleDownloadCompleteHtml}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
              <FaFileCode className="text-gray-600 group-hover:text-blue-600 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900">Styled HTML</p>
              <p className="text-sm text-gray-500">Complete HTML with Tailwind CSS (.html)</p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DownloadModal
