import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'

interface AppHeaderProps {
  /** Page title displayed next to back button */
  title: string
  /** Icon to display before title */
  titleIcon?: ReactNode
  /** Show back button (default: true) */
  showBackButton?: boolean
  /** Back link destination (default: /) */
  backTo?: string
  /** Dark mode state */
  darkMode: boolean
  /** Toggle dark mode callback */
  onToggleDarkMode: () => void
  /** Left side content (after title) */
  leftContent?: ReactNode
  /** Right side action buttons */
  rightContent?: ReactNode
  /** Additional icon buttons (between left content and dark mode toggle) */
  iconButtons?: ReactNode
}

/**
 * Reusable app header with consistent styling across pages
 * Based on the theme-editor header design
 */
export function AppHeader({
  title,
  titleIcon,
  showBackButton = true,
  backTo = '/',
  darkMode,
  onToggleDarkMode,
  leftContent,
  rightContent,
  iconButtons,
}: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <Tooltip id="header-tooltip" />
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <>
              <Link
                to={backTo}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
            </>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {titleIcon}
            {title}
          </h1>
          {leftContent}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {iconButtons}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-tooltip-id="header-tooltip"
            data-tooltip-content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
          </button>

          {rightContent}
        </div>
      </div>
    </header>
  )
}

export default AppHeader
