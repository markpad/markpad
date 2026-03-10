import { useState } from 'react'
import { FaTimes, FaCopy, FaCheck, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  publishUrl: string
  documentTitle: string
}

/**
 * Modal for publishing document to web
 * Shows the published URL with copy functionality
 */
export function PublishModal({ isOpen, onClose, publishUrl, documentTitle }: PublishModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publishUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = publishUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Publish to Web</h2>
              <p className="text-sm text-gray-500">Share your document with anyone</p>
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
        <div className="px-6 py-5">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Document</p>
            <p className="font-medium text-gray-900">{documentTitle}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Published URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={publishUrl}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono truncate focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 min-w-[100px] justify-center ${
                  copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck className="text-xs" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="text-xs" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Anyone with this link can view a read-only version of your document.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Close
          </button>
          <a
            href={publishUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FaExternalLinkAlt className="text-xs" />
            Open Preview
          </a>
        </div>
      </div>
    </div>
  )
}

export default PublishModal
