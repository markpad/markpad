import { useState, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaLink, FaDownload, FaFilePdf, FaSun, FaMoon, FaMagic } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import { Toast } from '../Toast'
import { DownloadModal } from '../DownloadModal'
import { useExportPdf } from '../../hooks/useExportPdf'
import type { TailwindClasses } from '../../types'

interface PublishedHeaderProps {
  documentTitle: string
  editorUrl: string
  markdown: string
  articleRef: RefObject<HTMLElement | null>
  tailwindClasses: TailwindClasses
  fontFamily: string
  darkMode: boolean
  onToggleDarkMode: () => void
  hasVariables?: boolean
  showWizard?: boolean
  onToggleWizard?: () => void
}

/**
 * Header for published/preview pages
 * Uses consistent styling with AppHeader
 */
export function PublishedHeader({
  documentTitle,
  editorUrl,
  markdown,
  articleRef,
  tailwindClasses,
  fontFamily,
  darkMode,
  onToggleDarkMode,
  hasVariables = false,
  showWizard = false,
  onToggleWizard,
}: PublishedHeaderProps) {
  const [showToast, setShowToast] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const pdfExport = useExportPdf()

  const currentUrl = window.location.href

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setShowToast(true)
    } catch {
      const input = document.createElement('input')
      input.value = currentUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setShowToast(true)
    }
  }

  const handlePrint = () => {
    pdfExport.handleExportPdf({
      documentTitle,
      htmlContent: getHtmlContent(),
      tailwindClasses,
      fontFamily,
    })
  }

  const getHtmlContent = () => {
    if (articleRef.current) {
      return articleRef.current.innerHTML
    }
    return ''
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 no-print">
      <Tooltip id="header-tooltip" />
      <div className="flex items-center justify-between">
        {/* Left - Back and Title */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          <h1
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] md:max-w-[400px]"
            title={documentTitle}
          >
            {documentTitle}
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Customize Button (only shown when document has variables) */}
          {hasVariables && onToggleWizard && (
            <button
              onClick={onToggleWizard}
              className={`p-2 rounded-md transition-colors ${
                showWizard
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              data-tooltip-id="header-tooltip"
              data-tooltip-content={
                showWizard ? 'Close customization panel' : 'Customize this document'
              }
            >
              <FaMagic className="w-4 h-4" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content="Copy link to clipboard"
          >
            <FaLink className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content="Download document"
          >
            <FaDownload className="w-4 h-4" />
          </button>

          {/* PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content="Print or save as PDF"
          >
            <FaFilePdf className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Edit Button */}
          <a
            href={editorUrl}
            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit in Markpad
          </a>
        </div>
      </div>

      {/* Toast for copy feedback */}
      <Toast
        message="Link copied to clipboard!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        documentTitle={documentTitle}
        markdown={markdown}
        htmlContent={getHtmlContent()}
        tailwindClasses={tailwindClasses}
        fontFamily={fontFamily}
      />
    </header>
  )
}

export default PublishedHeader
