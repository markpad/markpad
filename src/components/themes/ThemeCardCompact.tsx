import React from 'react'
import { ThemePreset } from '@/data/themes.generated'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import type { TailwindClasses } from '@/types'
import { getTextColorClass, getFontClass } from '@/components/themes/themeUtils'

interface ThemeCardCompactProps {
  theme: ThemePreset & { isLocal?: boolean }
  isActive: boolean
  isFavorite?: boolean
  onApply: () => void
  onDelete?: () => void
  onToggleFavorite?: () => void
}

// Compact preview that fits in sidebar - same logic as ThemeCard but compact
function CompactPreview({ theme }: { theme: ThemePreset }) {
  const { preview, tailwindClasses, fontFamily } = theme

  return (
    <div
      className={`h-16 rounded overflow-hidden p-2 ${tailwindClasses.body}`}
      style={{ fontFamily }}
    >
      {preview.style === 'brutalist' ? (
        <CompactBrutalistPreview preview={preview} classes={tailwindClasses} />
      ) : preview.style === 'minimal' ? (
        <CompactMinimalPreview preview={preview} classes={tailwindClasses} />
      ) : preview.style === 'mono' ? (
        <CompactMonoPreview preview={preview} classes={tailwindClasses} />
      ) : preview.style === 'serif' ? (
        <CompactSerifPreview preview={preview} classes={tailwindClasses} />
      ) : (
        <CompactDefaultPreview preview={preview} classes={tailwindClasses} />
      )}
    </div>
  )
}

function CompactDefaultPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  // Extract only color and font classes from h1/p
  const headingColor = getTextColorClass(classes.h1)
  const headingFont = getFontClass(classes.h1)
  const textColor = getTextColorClass(classes.p)
  const accentBg = getTextColorClass(classes.a).replace('text-', 'bg-')

  return (
    <div className="flex flex-col h-full justify-center space-y-1">
      <h4 className={`text-sm font-semibold truncate ${headingColor} ${headingFont}`}>
        {preview.sampleHeading}
      </h4>
      <p className={`text-[10px] leading-snug line-clamp-2 ${textColor}`}>{preview.sampleText}</p>
      <div className="flex gap-1 pt-1">
        <div className={`h-1 w-10 rounded-full ${accentBg}`} />
        <div className={`h-1 w-6 rounded-full ${accentBg} opacity-50`} />
      </div>
    </div>
  )
}

function CompactSerifPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const headingColor = getTextColorClass(classes.h1)
  const headingFont = getFontClass(classes.h1)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="flex flex-col h-full justify-center space-y-1">
      <h4 className={`text-sm font-semibold italic truncate ${headingColor} ${headingFont}`}>
        {preview.sampleHeading}
      </h4>
      <p className={`text-[10px] leading-snug line-clamp-2 ${textColor} opacity-80`}>
        {preview.sampleText}
      </p>
    </div>
  )
}

function CompactBrutalistPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  // Same logic as BrutalistPreview in ThemeCard
  const headingColor = getTextColorClass(classes.h1)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="flex flex-col h-full justify-center space-y-1.5">
      <div className="border-2 border-black px-2 py-1 inline-block self-start">
        <span className={`font-black text-[11px] tracking-wide ${headingColor}`}>
          {preview.sampleHeading}
        </span>
      </div>
      <p className={`font-bold text-[9px] tracking-wide truncate ${textColor}`}>
        {preview.sampleText}
      </p>
      <div className="flex gap-0.5">
        <div className="h-2 flex-1 bg-yellow-400" />
        <div className="h-2 flex-1 bg-blue-600" />
      </div>
    </div>
  )
}

function CompactMinimalPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  // Same logic as MinimalistPreview in ThemeCard
  const headingColor = getTextColorClass(classes.h1)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-1.5">
      <h4 className={`text-xs font-light tracking-[0.25em] uppercase ${headingColor}`}>
        {preview.sampleHeading}
      </h4>
      <p className={`text-[9px] tracking-[0.2em] uppercase opacity-70 ${textColor}`}>
        {preview.sampleText}
      </p>
    </div>
  )
}

function CompactMonoPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  // Same logic as MonoPreview in ThemeCard - use accent color from links
  const accentColor = getTextColorClass(classes.a)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="font-mono flex flex-col h-full justify-center space-y-1.5">
      <div className="bg-gray-800 rounded px-2 py-1 inline-block self-start border border-gray-700">
        <code className={`text-[10px] ${accentColor}`}>{preview.sampleHeading}</code>
      </div>
      <div className="flex items-center gap-1.5 text-[9px]">
        <span className={textColor}>{'<'}</span>
        <span className={accentColor}>{'>'}</span>
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
