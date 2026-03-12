import { useState } from 'react'
import { FaTimes, FaImage } from 'react-icons/fa'
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
  const { isOpen, close, imageConfig, setImageConfig, generateImageCode, reset, isValidUrl } =
    imageModal

  const [imageError, setImageError] = useState(false)

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleInsert = () => {
    const imageCode = generateImageCode()
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

        {/* Content */}
        <div className="p-6 space-y-4">
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
