import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** SVG illustration node */
  illustration: ReactNode
  /** Main heading */
  title: string
  /** Description paragraph */
  description: string
  /** Primary CTA button */
  action?: {
    label: string
    onClick: () => void
    /** Tailwind colour classes for the button, defaults to blue */
    color?: string
  }
  /** Secondary text link */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

/**
 * Shared empty state used across Documents / Templates / Themes pages.
 */
export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const btnColor = action?.color ?? 'bg-blue-500 hover:bg-blue-600'

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
      <div className="w-48 h-40 mb-6">{illustration}</div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`flex items-center gap-2 px-5 py-2.5 ${btnColor} text-white text-sm font-medium rounded-lg transition-colors shadow-sm`}
        >
          {action.label}
        </button>
      )}

      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  )
}
