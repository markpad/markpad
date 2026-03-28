import { useState, useMemo } from 'react'
import { FaTimes, FaSearch, FaCheck } from 'react-icons/fa'
import { themePresets, type ThemePreset } from '@/data/themes.generated'

interface ThemeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTheme: (theme: ThemePreset) => void
  currentThemeId?: string
}

export function ThemeSelectorModal({
  isOpen,
  onClose,
  onSelectTheme,
  currentThemeId,
}: ThemeSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(themePresets.map((t) => t.category))
    return ['all', ...Array.from(cats)]
  }, [])

  // Filter themes
  const filteredThemes = useMemo(() => {
    return themePresets.filter((theme) => {
      const matchesSearch =
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select a Theme</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredThemes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No themes found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme)
                    onClose()
                  }}
                  className={`relative text-left rounded-lg border-2 transition-all hover:shadow-md p-3 bg-white dark:bg-gray-800 ${
                    currentThemeId === theme.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {/* Theme Preview */}
                  <div
                    className={`h-20 rounded mb-2 overflow-hidden p-2 ${theme.tailwindClasses.body}`}
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    <div
                      className={`truncate text-xs mb-1 ${theme.tailwindClasses.h1
                        .split(' ')
                        .filter((c) => c.startsWith('text-') || c.startsWith('font-'))
                        .join(' ')}`}
                    >
                      {theme.preview.sampleHeading || 'Heading'}
                    </div>
                    <div
                      className={`text-[9px] leading-tight line-clamp-2 ${theme.tailwindClasses.p}`}
                    >
                      {theme.preview.sampleText || 'Sample text preview...'}
                    </div>
                  </div>
                  {/* Theme Info */}
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {theme.category}
                  </div>
                  {currentThemeId === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredThemes.length} themes available
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
