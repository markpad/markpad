import { useState } from 'react'
import { FaTimes, FaLink, FaClock, FaTrash, FaSearch } from 'react-icons/fa'
import type { UseLinkModalResult } from '@/hooks/useLinkModal'

interface LinkModalProps {
  /** Link modal state and handlers from useLinkModal hook */
  linkModal: UseLinkModalResult
  /** Callback when link is inserted */
  onInsertLink: (linkCode: string) => void
}

/**
 * Modal for inserting links into markdown
 * Follows Single Responsibility - only handles link insertion UI
 */
export function LinkModal({ linkModal, onInsertLink }: LinkModalProps) {
  const {
    isOpen,
    close,
    linkConfig,
    setLinkConfig,
    generateLinkCode,
    reset,
    isValidUrl,
    addToHistory,
    removeFromHistory,
    loadFromHistory,
    searchQuery,
    setSearchQuery,
    filteredHistory,
  } = linkModal

  const [activeTab, setActiveTab] = useState<'insert' | 'history'>('insert')

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleInsert = () => {
    const linkCode = generateLinkCode()
    addToHistory(linkConfig.url, linkConfig.text)
    onInsertLink(linkCode)
    reset()
    close()
  }

  const handleUrlChange = (value: string) => {
    setLinkConfig({ url: value })
  }

  const canInsert = linkConfig.url.trim().length > 0

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaLink className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insert Link
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add a hyperlink to your markdown
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
          <button
            onClick={() => setActiveTab('insert')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'insert'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            Insert
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <FaClock className="text-xs" />
            History
            {filteredHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                {filteredHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Insert Tab */}
          {activeTab === 'insert' && (
            <>
              {/* Link Text */}
              <div>
                <label
                  htmlFor="link-text-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Link Text
                </label>
                <input
                  id="link-text-input"
                  type="text"
                  value={linkConfig.text}
                  onChange={(e) => setLinkConfig({ text: e.target.value })}
                  placeholder="Click here"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The text that will be displayed (optional, uses URL if empty)
                </p>
              </div>

              {/* Link URL */}
              <div>
                <label
                  htmlFor="link-url-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  URL
                </label>
                <input
                  id="link-url-input"
                  type="url"
                  value={linkConfig.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
                {linkConfig.url && !isValidUrl && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    Please enter a valid URL
                  </p>
                )}
              </div>

              {/* Preview */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-xs">
                  Preview
                </label>
                <div className="w-full min-h-[80px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
                  {linkConfig.url ? (
                    <div className="text-center">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 break-all">
                        {generateLinkCode()}
                      </code>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={linkConfig.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
                        >
                          {linkConfig.text || linkConfig.url}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <FaLink className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Link preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <>
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by URL or text..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* History List */}
              {filteredHistory.length > 0 ? (
                <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.timestamp}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <button
                        onClick={() => {
                          loadFromHistory(item)
                          setActiveTab('insert')
                        }}
                        className="flex-1 text-left min-w-0"
                        title="Load this link"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                          {item.text || item.url}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.url}
                        </div>
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.timestamp)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                        title="Remove from history"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaClock className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'No matching links found' : 'No links in history yet'}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {searchQuery ? 'Try a different search term' : 'Insert a link to see it here'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={close}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!canInsert}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  )
}
