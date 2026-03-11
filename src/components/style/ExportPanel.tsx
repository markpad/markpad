import { FaDownload, FaMarkdown, FaCode, FaFileCode, FaCheck } from 'react-icons/fa'
import type { TailwindClasses } from '../../types'
import { processMarkdownWithFrontmatter } from '../../utils/frontmatter'

interface ExportPanelProps {
  documentTitle: string
  markdown: string
  htmlContent: string
  tailwindClasses: TailwindClasses
  fontFamily: string
}

/**
 * Export panel for sidebar - allows downloading document in different formats
 */
export function ExportPanel({
  documentTitle,
  markdown,
  htmlContent,
  tailwindClasses,
  fontFamily,
}: ExportPanelProps) {
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
  }

  const handleDownloadMarkdownOriginal = () => {
    downloadFile(markdown, `${documentTitle}.md`, 'text/markdown')
  }

  const handleDownloadMarkdownProcessed = () => {
    const { processedContent } = processMarkdownWithFrontmatter(markdown)
    downloadFile(processedContent, `${documentTitle}-processed.md`, 'text/markdown')
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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <FaDownload className="text-white text-sm" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Export</h2>
          <p className="text-xs text-gray-500">Download your document</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Markdown Section */}
        <div className="flex items-center gap-2 mb-2">
          <FaMarkdown className="text-gray-400 text-sm" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Markdown
          </span>
        </div>

        {/* Markdown Original */}
        <button
          onClick={handleDownloadMarkdownOriginal}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
            <FaMarkdown className="text-gray-600 group-hover:text-blue-600" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">Original</p>
            <p className="text-xs text-gray-500 truncate">With frontmatter & variables</p>
          </div>
        </button>

        {/* Markdown Processed */}
        <button
          onClick={handleDownloadMarkdownProcessed}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors">
            <FaCheck className="text-gray-600 group-hover:text-green-600" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">Processed</p>
            <p className="text-xs text-gray-500 truncate">Variables resolved, portable</p>
          </div>
        </button>

        {/* HTML Section */}
        <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-100">
          <FaCode className="text-gray-400 text-sm" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">HTML</span>
        </div>

        {/* Simple HTML */}
        <button
          onClick={handleDownloadSimpleHtml}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
            <FaCode className="text-gray-600 group-hover:text-blue-600" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">Simple HTML</p>
            <p className="text-xs text-gray-500 truncate">Plain HTML without styles</p>
          </div>
        </button>

        {/* Styled HTML */}
        <button
          onClick={handleDownloadCompleteHtml}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
            <FaFileCode className="text-gray-600 group-hover:text-blue-600" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">Styled HTML</p>
            <p className="text-xs text-gray-500 truncate">Complete with Tailwind CSS</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-500">Tailwind Engine: JIT</span>
      </div>
    </div>
  )
}

export default ExportPanel
