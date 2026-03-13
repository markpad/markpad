import React from 'react'
import { ThemePreset } from '../../data/themes.generated'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

interface ThemeCardCompactProps {
  theme: ThemePreset & { isLocal?: boolean }
  isActive: boolean
  isFavorite?: boolean
  onApply: () => void
  onDelete?: () => void
  onToggleFavorite?: () => void
}

// Compact preview that fits in sidebar
function CompactPreview({ theme }: { theme: ThemePreset }) {
  // Use the preview colors directly from theme data
  const { bgColor, textColor, accentColor, headingFont, bodyFont } = theme.preview

  return (
    <div
      className="h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-600 p-2"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="truncate text-xs mb-1 font-bold"
        style={{ fontFamily: headingFont, color: accentColor }}
      >
        Heading
      </div>
      <div
        className="text-[8px] leading-tight line-clamp-2"
        style={{ fontFamily: bodyFont, color: textColor }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
      </div>
    </div>
  )
}

export function ThemeCardCompact({
  theme,
  isActive,
  isFavorite,
  onApply,
  onDelete,
  onToggleFavorite,
}: ThemeCardCompactProps) {
  const isLocal = 'isLocal' in theme && theme.isLocal

  return (
    <button
      onClick={onApply}
      className={`
        w-full text-left rounded-lg border-2 transition-all p-2
        ${
          isActive
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
    >
      <CompactPreview theme={theme} />

      <div className="mt-2 flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {theme.name}
            </span>
            {isLocal && (
              <span className="flex-shrink-0 text-[10px] px-1 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded">
                Local
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{theme.description}</p>
        </div>

        <div className="flex items-center gap-1">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className={`flex-shrink-0 p-1 rounded transition-colors ${
                isFavorite
                  ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <FaHeart className="w-3 h-3" /> : <FaRegHeart className="w-3 h-3" />}
            </button>
          )}

          {isLocal && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="flex-shrink-0 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Delete theme"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </button>
  )
}
