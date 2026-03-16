import { Link, useLocation } from 'react-router-dom'
import { FaFileAlt, FaCopy, FaPalette } from 'react-icons/fa'

const NAV_ITEMS = [
  { to: '/documents', label: 'Documents', icon: FaFileAlt },
  { to: '/templates', label: 'Templates', icon: FaCopy },
  { to: '/themes', label: 'Themes', icon: FaPalette },
]

/**
 * Navigation links for Documents / Templates / Themes pages.
 * Renders in the navbar right side with active page highlighted.
 */
export function PageNavLinks() {
  const { pathname } = useLocation()

  return (
    <div className="flex items-center gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = pathname.startsWith(to)
        return (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="text-xs" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
