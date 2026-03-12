import { FaTimes, FaCodeBranch } from 'react-icons/fa'
import type { UseIfModalResult, ComparisonOperator } from '../hooks/useIfModal'

interface IfModalProps {
  /** IF modal state and handlers from useIfModal hook */
  ifModal: UseIfModalResult
  /** Callback when if is inserted */
  onInsertIf: (ifCode: string) => void
}

const OPERATOR_OPTIONS: { value: ComparisonOperator; label: string; needsValue: boolean }[] = [
  { value: 'truthy', label: 'is truthy (exists and not empty)', needsValue: false },
  { value: 'not', label: 'is falsy (not exists or empty)', needsValue: false },
  { value: '==', label: 'equals (==)', needsValue: true },
  { value: '!=', label: 'not equals (!=)', needsValue: true },
  { value: '>', label: 'greater than (>)', needsValue: true },
  { value: '<', label: 'less than (<)', needsValue: true },
  { value: '>=', label: 'greater than or equal (>=)', needsValue: true },
  { value: '<=', label: 'less than or equal (<=)', needsValue: true },
]

/**
 * Modal for inserting conditional constructs into markdown
 * Follows Single Responsibility - only handles if insertion UI
 */
export function IfModal({ ifModal, onInsertIf }: IfModalProps) {
  const {
    isOpen,
    close,
    availableVariables,
    ifConfig,
    setIfConfig,
    generateIfCode,
    reset,
    preview,
  } = ifModal

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const handleInsert = () => {
    const ifCode = generateIfCode()
    onInsertIf(ifCode)
    reset()
    close()
  }

  const selectedOperator = OPERATOR_OPTIONS.find((op) => op.value === ifConfig.operator)
  const needsCompareValue = selectedOperator?.needsValue ?? false
  const canInsert =
    ifConfig.variableName && (!needsCompareValue || ifConfig.compareValue.trim().length > 0)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <FaCodeBranch className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insert Conditional
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show content based on conditions
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
          {/* Variable Selection */}
          <div>
            <label
              htmlFor="variable-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Variable to Check
            </label>
            {availableVariables.length > 0 ? (
              <select
                id="variable-select"
                value={ifConfig.variableName}
                onChange={(e) => setIfConfig({ variableName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Select a variable...</option>
                {availableVariables.map((variable) => (
                  <option key={variable} value={variable}>
                    {variable}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No variables found in frontmatter
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Add variables to your frontmatter to use conditionals
                </p>
              </div>
            )}
          </div>

          {/* Operator Selection */}
          <div>
            <label
              htmlFor="operator-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Comparison Type
            </label>
            <select
              id="operator-select"
              value={ifConfig.operator}
              onChange={(e) => setIfConfig({ operator: e.target.value as ComparisonOperator })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              {OPERATOR_OPTIONS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {/* Compare Value (only for operators that need it) */}
          {needsCompareValue && (
            <div>
              <label
                htmlFor="compare-value-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Compare To
              </label>
              <input
                id="compare-value-input"
                type="text"
                value={ifConfig.compareValue}
                onChange={(e) => setIfConfig({ compareValue: e.target.value })}
                placeholder="Enter value to compare (e.g., 18, 'admin', true)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          )}

          {/* Content Template */}
          <div>
            <label
              htmlFor="content-template-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content to Show
            </label>
            <textarea
              id="content-template-input"
              value={ifConfig.contentTemplate}
              onChange={(e) => setIfConfig({ contentTemplate: e.target.value })}
              placeholder="Content that will be shown when the condition is true"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preview
              </label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all font-mono">
                  {preview}
                </pre>
              </div>
            </div>
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
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-cyan-600"
          >
            Insert Conditional
          </button>
        </div>
      </div>
    </div>
  )
}
