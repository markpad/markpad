import { FaDownload, FaMarkdown, FaCode, FaFileCode, FaCheck, FaFilePdf } from 'react-icons/fa'
import type { TailwindClasses } from '@/types'
import { processMarkdownWithFrontmatter } from '@/utils/frontmatter'
import { generateStyledHtml, downloadFile } from '@/utils/htmlGenerator'
import { useExportPdf } from '@/hooks/useExportPdf'

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
  const pdfExport = useExportPdf()

  const handleDownloadMarkdownOriginal = () => {
    downloadFile(markdown, `${documentTitle}.md`, 'text/markdown')
  }

  const handleDownloadMarkdownProcessed = () => {
    const { processedContent } = processMarkdownWithFrontmatter(markdown)
    downloadFile(processedContent, `${documentTitle}-processed.md`, 'text/markdown')
  }

  const handleDownloadStyledHtml = () => {
    const styledHtml = generateStyledHtml({
      documentTitle,
      htmlContent,
      tailwindClasses,
      fontFamily,
    })
    downloadFile(styledHtml, `${documentTitle}-styled.html`, 'text/html')
  }

  const handleExportPdf = () => {
    pdfExport.handleExportPdf({
      documentTitle,
      htmlContent,
      tailwindClasses,
      fontFamily,
    })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <FaDownload className="text-white text-sm" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Export</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Download your document</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Markdown Section */}
        <div className="flex items-center gap-2 mb-2">
          <FaMarkdown className="text-gray-400 dark:text-gray-500 text-sm" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Markdown
          </span>
        </div>

        {/* Markdown Original */}
        <button
          onClick={handleDownloadMarkdownOriginal}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors">
            <FaMarkdown className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Original</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              With frontmatter & variables
            </p>
          </div>
        </button>

        {/* Markdown Processed */}
        <button
          onClick={handleDownloadMarkdownProcessed}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 rounded-lg flex items-center justify-center transition-colors">
            <FaCheck className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Processed</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Variables resolved, portable
            </p>
          </div>
        </button>

        {/* HTML Section */}
        <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <FaCode className="text-gray-400 dark:text-gray-500 text-sm" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            HTML
          </span>
        </div>

        {/* Styled HTML */}
        <button
          onClick={handleDownloadStyledHtml}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors">
            <FaFileCode className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Styled HTML</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Complete with Tailwind CSS & fonts
            </p>
          </div>
        </button>

        {/* PDF Section */}
        <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <FaFilePdf className="text-gray-400 dark:text-gray-500 text-sm" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            PDF
          </span>
        </div>

        {/* PDF Export */}
        <button
          onClick={handleExportPdf}
          className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
        >
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 rounded-lg flex items-center justify-center transition-colors">
            <FaFilePdf className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Save as PDF</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Styled document ready to print
            </p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">Tailwind Engine: JIT</span>
      </div>
    </div>
  )
}

export default ExportPanel
