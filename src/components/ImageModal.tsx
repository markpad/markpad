import { useState } from 'react'
import { FaTimes, FaImage, FaClock, FaTrash, FaSearch } from 'react-icons/fa'
import type { UseImageModalResult } from '../hooks/useImageModal'

interface ImageModalProps {
  /** Image modal state and handlers from useImageModal hook */
  imageModal: UseImageModalResult
  /** Callback when image is inserted */
  onInsertImage: (imageCode: string) => void
}

/**
 * Modal for inserting images into markdown
 * Follows Single Responsibility - only handles image insertion UI
 */
export function ImageModal({ imageModal, onInsertImage }: ImageModalProps) {
  const {
    isOpen,
    close,
    imageConfig,
    setImageConfig,
    generateImageCode,
    reset,
    isValidUrl,
    addToHistory,
    removeFromHistory,
    loadFromHistory,
    searchQuery,
    setSearchQuery,
    filteredHistory,
  } = imageModal

  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState<'insert' | 'history'>('insert')

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleInsert = () => {
    const imageCode = generateImageCode()
    addToHistory(imageConfig.url, imageConfig.altText)
    onInsertImage(imageCode)
    reset()
    setImageError(false)
    close()
  }

  const handleUrlChange = (value: string) => {
    setImageConfig({ url: value })
    setImageError(false)
  }

  const canInsert = imageConfig.url.trim().length > 0

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <FaImage className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insert Image
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an image to your markdown
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
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            Insert
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <FaClock className="text-xs" />
            History
            {filteredHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
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
              {/* Image URL */}
              <div>
                <label
                  htmlFor="image-url-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Image URL
                </label>
                <input
                  id="image-url-input"
                  type="url"
                  value={imageConfig.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label
                  htmlFor="alt-text-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Alt Text
                </label>
                <input
                  id="alt-text-input"
                  type="text"
                  value={imageConfig.altText}
                  onChange={(e) => setImageConfig({ altText: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-xs">
                  Preview
                </label>
                <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                  {isValidUrl && !imageError ? (
                    <img
                      src={imageConfig.url}
                      alt={imageConfig.altText || 'Image preview'}
                      className="max-w-full max-h-full object-contain"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  ) : (
                    <div className="text-center px-4">
                      <FaImage className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {imageError
                          ? 'Failed to load image'
                          : imageConfig.url
                            ? 'Invalid URL'
                            : 'Image preview will appear here'}
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
                  placeholder="Search by URL or description..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* History List */}
              {filteredHistory.length > 0 ? (
                <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.timestamp}
                      className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img
                          src={item.url}
                          alt={item.altText || 'Preview'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const icon = document.createElement('div')
                              icon.className =
                                'fallback-icon w-full h-full flex items-center justify-center'
                              icon.innerHTML =
                                '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>'
                              parent.appendChild(icon)
                            }
                          }}
                        />
                      </div>

                      {/* Content */}
                      <button
                        onClick={() => {
                          loadFromHistory(item)
                          setActiveTab('insert')
                        }}
                        className="flex-1 text-left min-w-0"
                        title="Load this image"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-0.5">
                          {item.altText || 'No description'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.url}
                        </div>
                      </button>

                      {/* Remove button */}
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
                    {searchQuery ? 'No matching images found' : 'No images in history yet'}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {searchQuery ? 'Try a different search term' : 'Insert an image to see it here'}
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
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  )
}
