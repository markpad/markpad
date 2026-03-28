import { ThemeCardCompact } from '@/components/themes/ThemeCardCompact'
import { useStyleSidebar } from '@/hooks/useStyleSidebar'
import { ThemePreset, themePresets } from '@/data/themes.generated'
import { FaPalette, FaSearch, FaTimes, FaHeart, FaSave } from 'react-icons/fa'

// Style panel props interface
interface StylePanelProps {
  currentThemeId?: string
  isCustomTheme?: boolean
  customThemeName?: string
  onCustomThemeNameChange?: (name: string) => void
  onApplyTheme: (theme: ThemePreset) => void
  onResetToDefault?: () => void
  onSaveCustomTheme?: (name: string) => Pick<
    ThemePreset,
    'tailwindClasses' | 'fontConfig' | 'fontFamily'
  > & {
    name: string
  }
}

/**
 * Style configuration panel — Themes tab
 * Allows selecting and saving themes for the current document.
 */
export function StylePanel({
  currentThemeId,
  isCustomTheme = false,
  customThemeName = 'Custom Theme',
  onCustomThemeNameChange,
  onApplyTheme,
  onResetToDefault,
  onSaveCustomTheme,
}: StylePanelProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredThemes,
    favoriteThemes,
    deleteLocalTheme,
    toggleFavorite,
    isFavorite,
    saveAsLocalTheme,
  } = useStyleSidebar()

  // Get current theme info
  const currentTheme = currentThemeId
    ? [...themePresets, ...filteredThemes].find((t) => t.id === currentThemeId)
    : null

  // Handle saving custom theme as a local preset
  const handleSaveTheme = () => {
    if (!onSaveCustomTheme) return
    const themeConfig = onSaveCustomTheme(customThemeName)
    const savedTheme = saveAsLocalTheme(themeConfig.name, themeConfig)
    onApplyTheme(savedTheme)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <FaPalette className="text-blue-500 dark:text-blue-400 text-sm" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Themes</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {/* Current Theme Section */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Current Theme
              </span>
              {isCustomTheme && onResetToDefault && (
                <button
                  onClick={onResetToDefault}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Reset to default"
                >
                  <FaTimes className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {isCustomTheme ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <FaPalette className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={customThemeName}
                      onChange={(e) => onCustomThemeNameChange?.(e.target.value)}
                      className="w-full font-medium text-sm text-gray-900 dark:text-gray-100 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors px-1 -mx-1"
                      placeholder="Custom Theme"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">Not saved yet</div>
                  </div>
                </div>
                {onSaveCustomTheme && (
                  <button
                    onClick={handleSaveTheme}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded transition-all shadow-sm hover:shadow"
                  >
                    <FaSave className="w-3 h-3" />
                    Save as Preset
                  </button>
                )}
              </div>
            ) : currentTheme ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {currentTheme.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {currentTheme.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                      {currentTheme.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(currentTheme.id)}
                  className={`p-1.5 rounded transition-colors ${
                    isFavorite(currentTheme.id)
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                  title={isFavorite(currentTheme.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite(currentTheme.id) ? (
                    <FaHeart className="w-4 h-4" />
                  ) : (
                    <FaHeart className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
            ) : null}
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Favorites Section */}
          {favoriteThemes.length > 0 && !searchQuery && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                <FaHeart className="w-3 h-3 text-red-500" />
                Favorites
              </div>
              {favoriteThemes.map((theme) => (
                <ThemeCardCompact
                  key={`fav-${theme.id}`}
                  theme={theme}
                  isActive={currentThemeId === theme.id}
                  isFavorite={true}
                  onApply={() => onApplyTheme(theme)}
                  onToggleFavorite={() => toggleFavorite(theme.id)}
                  onDelete={
                    'isLocal' in theme && theme.isLocal
                      ? () => deleteLocalTheme(theme.id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}

          {/* All Themes */}
          <div className="space-y-2">
            {!searchQuery && favoriteThemes.length > 0 && (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-2">
                All Themes
              </div>
            )}
            {filteredThemes.map((theme) => (
              <ThemeCardCompact
                key={theme.id}
                theme={theme}
                isActive={currentThemeId === theme.id}
                isFavorite={isFavorite(theme.id)}
                onApply={() => onApplyTheme(theme)}
                onToggleFavorite={() => toggleFavorite(theme.id)}
                onDelete={
                  'isLocal' in theme && theme.isLocal ? () => deleteLocalTheme(theme.id) : undefined
                }
              />
            ))}
            {filteredThemes.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No themes found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">Tailwind Engine: JIT</span>
      </div>
    </div>
  )
}
