import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaSync, FaPlus, FaCode } from 'react-icons/fa'
import type { UseLoopModalResult } from '../hooks/useLoopModal'

interface LoopModalProps {
  /** Loop modal state and handlers from useLoopModal hook */
  loopModal: UseLoopModalResult
  /** Callback when loop is inserted */
  onInsertLoop: (loopCode: string, updatedMarkdown: string) => void
}

/**
 * Modal for inserting loop constructs into markdown
 * Follows Single Responsibility - only handles loop insertion UI
 */
export function LoopModal({ loopModal, onInsertLoop }: LoopModalProps) {
  const {
    isOpen,
    close,
    availableArrays,
    loopConfig,
    setLoopConfig,
    isCreatingNewArray,
    setIsCreatingNewArray,
    newArrayConfig,
    setNewArrayConfig,
    generateLoopCode,
    getUpdatedMarkdown,
    reset,
    preview,
  } = loopModal

  // Track raw textarea input to preserve newlines while typing
  const [itemsInput, setItemsInput] = useState('')

  // Track previous isOpen state to detect modal opening
  const prevIsOpenRef = useRef(false)

  // Reset itemsInput only when modal opens (not when items change)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Modal just opened - reset to initial state
      setItemsInput(newArrayConfig.items.join('\n'))
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleInsert = () => {
    const loopCode = generateLoopCode()
    const updatedMarkdown = getUpdatedMarkdown()
    onInsertLoop(loopCode, updatedMarkdown)
    reset()
    close()
  }

  const handleItemsChange = (value: string) => {
    setItemsInput(value)
    const items = value
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    setNewArrayConfig({ items })
  }

  const canInsert = isCreatingNewArray
    ? newArrayConfig.name && newArrayConfig.items.length > 0
    : loopConfig.arrayName

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaSync className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insert Loop
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create repeating content from arrays
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
          {/* Array Selection Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsCreatingNewArray(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isCreatingNewArray
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Use Existing Array
            </button>
            <button
              onClick={() => setIsCreatingNewArray(true)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isCreatingNewArray
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FaPlus className="text-xs" />
              Create New Array
            </button>
          </div>

          {/* Existing Array Selection */}
          {!isCreatingNewArray && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Array Variable
              </label>
              {availableArrays.length > 0 ? (
                <select
                  value={loopConfig.arrayName}
                  onChange={(e) => setLoopConfig({ arrayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select an array...</option>
                  {availableArrays.map((array) => (
                    <option key={array} value={array}>
                      {array}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No arrays found in frontmatter
                  </p>
                  <button
                    onClick={() => setIsCreatingNewArray(true)}
                    className="mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                  >
                    Create a new array instead
                  </button>
                </div>
              )}
            </div>
          )}

          {/* New Array Creation */}
          {isCreatingNewArray && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="array-name-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Array Name
                </label>
                <input
                  id="array-name-input"
                  type="text"
                  value={newArrayConfig.name}
                  onChange={(e) => setNewArrayConfig({ name: e.target.value })}
                  placeholder="e.g., skills, projects, languages"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="items-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Items (one per line)
                </label>
                <textarea
                  id="items-input"
                  value={itemsInput}
                  onChange={(e) => handleItemsChange(e.target.value)}
                  placeholder="JavaScript&#10;TypeScript&#10;React"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          )}

          {/* Loop Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Iterator Variable
              </label>
              <input
                type="text"
                value={loopConfig.iteratorName}
                onChange={(e) => setLoopConfig({ iteratorName: e.target.value })}
                placeholder="item"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Template
              </label>
              <input
                type="text"
                value={loopConfig.itemTemplate}
                onChange={(e) => setLoopConfig({ itemTemplate: e.target.value })}
                placeholder="- {{item}}"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <FaCode className="text-purple-500 dark:text-purple-400" />
                Preview
              </label>
              <pre className="px-3 py-2 bg-gray-900 text-green-400 rounded-lg text-sm font-mono overflow-x-auto">
                {preview}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={close}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!canInsert}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canInsert
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Insert Loop
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoopModal
