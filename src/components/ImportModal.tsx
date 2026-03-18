import { useState } from 'react'
import {
  FaTimes,
  FaFileUpload,
  FaGlobe,
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaFile,
} from 'react-icons/fa'
import type { UseImportModalResult } from '../hooks/useImportModal'
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE, formatFileSize } from '../hooks/useFileImport'

/** Import action types */
export type ImportAction = 'replace' | 'createNew' | 'createAndOpen'

/** Context where ImportModal is used */
export type ImportContext = 'editor' | 'documents'

interface ImportModalProps {
  /** Import modal state and handlers from useImportModal hook */
  importModal: UseImportModalResult
  /** Context where the modal is used (affects available actions) */
  context: ImportContext
  /** Callback when content is imported (markdown content, optional title, action) */
  onImport: (content: string, title: string | undefined, action: ImportAction) => void
}

/**
 * Modal for importing markdown content from file or URL.
 * Two tabs: "My Computer" (drag & drop / file picker) and "Web URL" (web clipper).
 */
export function ImportModal({ importModal, context, onImport }: ImportModalProps) {
  const { isOpen, close, activeTab, setActiveTab, fileImport, urlImport } = importModal

  // Default action based on context
  const defaultAction: ImportAction = context === 'editor' ? 'replace' : 'createAndOpen'
  const [action, setAction] = useState<ImportAction>(defaultAction)

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleImport = () => {
    if (activeTab === 'file' && fileImport.result) {
      const title = fileImport.result.fileName.replace(/\.(md|markdown|txt)$/, '')
      onImport(fileImport.result.content, title, action)
      close()
    } else if (activeTab === 'url' && urlImport.result) {
      onImport(urlImport.result.content, urlImport.result.title, action)
      close()
    }
  }

  const canImport =
    (activeTab === 'file' && fileImport.status === 'success') ||
    (activeTab === 'url' && urlImport.status === 'success')

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <FaFileUpload className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Import Document
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Import from file or web URL
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <TabButton
            active={activeTab === 'file'}
            onClick={() => setActiveTab('file')}
            icon={<FaFileUpload className="text-xs" />}
            label="My Computer"
          />
          <TabButton
            active={activeTab === 'url'}
            onClick={() => setActiveTab('url')}
            icon={<FaGlobe className="text-xs" />}
            label="Web URL"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'file' && <FileImportTab fileImport={importModal.fileImport} />}
          {activeTab === 'url' && <UrlImportTab urlImport={importModal.urlImport} />}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          {/* Action selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Action:</span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as ImportAction)}
              className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {context === 'editor' ? (
                <>
                  <option value="replace">Overwrite current document</option>
                  <option value="createNew">Create new document</option>
                </>
              ) : (
                <>
                  <option value="createAndOpen">Create and open</option>
                  <option value="createNew">Create without opening</option>
                </>
              )}
            </select>
          </div>

          {/* Info and buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {activeTab === 'file' && (
                <span>
                  Max {formatFileSize(MAX_FILE_SIZE)} · {ACCEPTED_EXTENSIONS.join(', ')}
                </span>
              )}
              {activeTab === 'url' && <span>Articles, blog posts, documentation pages</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={close}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!canImport}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sub-components ---

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
        active
          ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 bg-white dark:bg-gray-800'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function FileImportTab({ fileImport }: { fileImport: UseImportModalResult['fileImport'] }) {
  const {
    status,
    error,
    result,
    openFilePicker,
    fileInputRef,
    handleFileInputChange,
    handleDrop,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    reset,
  } = fileImport

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef as React.RefObject<HTMLInputElement>}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drop zone */}
      {status !== 'success' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={openFilePicker}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
          }`}
        >
          <FaCloudUploadAlt
            className={`text-4xl mx-auto mb-3 ${
              isDragging ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Drop your markdown file here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            or{' '}
            <span className="text-orange-600 dark:text-orange-400 font-medium">browse files</span>{' '}
            on your device
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-wider">
            Supported: {ACCEPTED_EXTENSIONS.join(', ')}
          </p>
        </div>
      )}

      {/* Success state */}
      {status === 'success' && result && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FaFile className="text-gray-400 text-sm" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {result.fileName}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatFileSize(result.fileSize)} · Ready to import
            </p>
          </div>
          <button
            onClick={reset}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            Change
          </button>
        </div>
      )}

      {/* Reading state */}
      {status === 'reading' && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <FaSpinner className="text-blue-500 animate-spin" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Reading file…</span>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={reset}
              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function UrlImportTab({ urlImport }: { urlImport: UseImportModalResult['urlImport'] }) {
  const { status, error, result, url, setUrl, importFromUrl, isValidUrl, reset } = urlImport

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidUrl && status !== 'loading') {
      importFromUrl()
    }
  }

  return (
    <div className="space-y-4">
      {/* URL input */}
      <div>
        <label
          htmlFor="import-url-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Page URL
        </label>
        <div className="flex gap-2">
          <input
            id="import-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/article"
            disabled={status === 'loading'}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={importFromUrl}
            disabled={!isValidUrl || status === 'loading'}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? <FaSpinner className="animate-spin" /> : 'Fetch'}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <FaSpinner className="text-blue-500 animate-spin" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Fetching article…</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Extracting content and converting to markdown
            </p>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === 'success' && result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {result.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {result.source}
              </p>
            </div>
            <button
              onClick={reset}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline flex-shrink-0"
            >
              Change
            </button>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
              Preview
            </label>
            <pre className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {result.content.slice(0, 500)}
              {result.content.length > 500 && '…'}
            </pre>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={reset}
              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Hint */}
      {status === 'idle' && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Paste a URL to any article, blog post, or documentation page. The content will be
          extracted and converted to markdown with metadata.
        </p>
      )}
    </div>
  )
}
