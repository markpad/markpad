import { FaTimes, FaDownload, FaMarkdown, FaCode, FaFileCode, FaCheck } from 'react-icons/fa'
import type { TailwindClasses } from '../types'
import { processMarkdownWithFrontmatter } from '../utils/frontmatter'
import { generateStyledHtml, downloadFile } from '../utils/htmlGenerator'

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

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    downloadFile(content, filename, mimeType)
    onClose()
  }

  const handleDownloadMarkdownOriginal = () => {
    handleDownloadFile(markdown, `${documentTitle}.md`, 'text/markdown')
  }

  const handleDownloadMarkdownProcessed = () => {
    const { processedContent } = processMarkdownWithFrontmatter(markdown)
    handleDownloadFile(processedContent, `${documentTitle}-processed.md`, 'text/markdown')
  }

  const handleDownloadStyledHtml = () => {
    const styledHtml = generateStyledHtml({
      documentTitle,
      htmlContent,
      tailwindClasses,
      fontFamily,
    })
    handleDownloadFile(styledHtml, `${documentTitle}-styled.html`, 'text/html')
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaDownload className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Download Document
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Markdown Section Header */}
          <div className="flex items-center gap-2 mb-2">
            <FaMarkdown className="text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Markdown
            </span>
          </div>

          {/* Markdown Original Option */}
          <button
            onClick={handleDownloadMarkdownOriginal}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors">
              <FaMarkdown className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">Original</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                With frontmatter, variables & loops (.md)
              </p>
            </div>
          </button>

          {/* Markdown Processed Option */}
          <button
            onClick={handleDownloadMarkdownProcessed}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 rounded-lg flex items-center justify-center transition-colors">
              <FaCheck className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">Processed (Portable)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Clean markdown, variables resolved (.md)
              </p>
            </div>
          </button>

          {/* HTML Section Header */}
          <div className="flex items-center gap-2 mb-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <FaCode className="text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              HTML
            </span>
          </div>

          {/* Styled HTML Option */}
          <button
            onClick={handleDownloadStyledHtml}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors">
              <FaFileCode className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-lg" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">Styled HTML</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete with Tailwind CSS & fonts (.html)
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DownloadModal
