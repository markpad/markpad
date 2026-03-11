import { useState, RefObject } from 'react'
import {
  FaFileAlt,
  FaLink,
  FaDownload,
  FaFilePdf,
  FaChevronRight,
  FaSun,
  FaMoon,
} from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import { Toast } from '../Toast'
import { DownloadModal } from '../DownloadModal'
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
}

/**
 * Minimal header for published/preview pages
 * Similar to MarkLab published document header
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
}: PublishedHeaderProps) {
  const [showToast, setShowToast] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)

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
    window.print()
  }

  const getHtmlContent = () => {
    if (articleRef.current) {
      return articleRef.current.innerHTML
    }
    return ''
  }

  return (
    <header
      className={`sticky top-0 z-50 no-print transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-white border-b border-gray-200 shadow-sm'}`}
    >
      <Tooltip id="header-tooltip" />
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left - Logo and Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          {/* App Icon + Name */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded">
              <FaFileAlt className="text-white text-xs" />
            </div>
            <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Marklab
            </span>
          </a>

          {/* Breadcrumb Separator */}
          <FaChevronRight className="text-gray-500 text-xs flex-shrink-0" />

          {/* Document Title */}
          <span
            className={`text-sm truncate max-w-[150px] md:max-w-[300px] lg:max-w-[400px] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {documentTitle}
          </span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Icon Group */}
          <div
            className={`flex items-center gap-1 border-r pr-3 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
          >
            {/* Light/Dark Toggle */}
            <button
              onClick={() => onToggleDarkMode()}
              className={`p-2 rounded-md transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              data-tooltip-id="header-tooltip"
              data-tooltip-content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-md transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              data-tooltip-id="header-tooltip"
              data-tooltip-content="Copy link to clipboard"
            >
              <FaLink className="text-sm" />
            </button>

            {/* Download Options */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className={`p-2 rounded-md transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              data-tooltip-id="header-tooltip"
              data-tooltip-content="Download document"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>

          {/* PDF Button */}
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-all text-sm ${darkMode ? 'text-gray-300 hover:text-white border-gray-600 hover:border-gray-500' : 'text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400'}`}
            data-tooltip-id="header-tooltip"
            data-tooltip-content="Print or save as PDF"
          >
            <FaFilePdf className="text-sm" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Edit in MarkLab Button */}
          <a
            href={editorUrl}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content="Open this document in the editor"
          >
            <span>Edit in MarkLab</span>
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
