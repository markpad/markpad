import { useState } from 'react'
import type { TailwindClasses, FontConfig } from '@/types'
import { GOOGLE_FONTS } from '@/types'
import { TailwindClassInput } from '@/components/style/TailwindClassInput'
import { ThemeCardCompact } from '@/components/themes/ThemeCardCompact'
import { useStyleSidebar } from '@/hooks/useStyleSidebar'
import { useUserSettings } from '@/hooks/useUserSettings'
import { ThemePreset, themePresets } from '@/data/themes.generated'
import {
  FaChevronDown,
  FaChevronRight,
  FaFont,
  FaPalette,
  FaCog,
  FaSearch,
  FaTimes,
  FaHeart,
  FaSave,
} from 'react-icons/fa'

// Style panel props interface
interface StylePanelProps {
  tailwindClasses: TailwindClasses
  fontConfig: FontConfig
  currentThemeId?: string
  isCustomTheme?: boolean
  customThemeName?: string
  onCustomThemeNameChange?: (name: string) => void
  onTailwindClassChange: (element: keyof TailwindClasses, value: string) => void
  onFontConfigChange: <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => void
  onApplyTheme: (theme: ThemePreset) => void
  onResetToDefault?: () => void
  onSaveCustomTheme?: (name: string) => Pick<
    ThemePreset,
    'tailwindClasses' | 'fontConfig' | 'fontFamily'
  > & {
    name: string
  }
}

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
        <span className="text-sm font-medium">{title}</span>
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

// Tab button component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors
        ${
          active
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-b-2 border-transparent'
        }
      `}
    >
      <Icon className="text-xs" />
      {label}
    </button>
  )
}

/**
 * Style configuration panel
 * Allows customization of Tailwind classes for each markdown element
 */
export function StylePanel({
  tailwindClasses,
  fontConfig,
  currentThemeId,
  isCustomTheme = false,
  customThemeName = 'Custom Theme',
  onCustomThemeNameChange,
  onTailwindClassChange,
  onFontConfigChange,
  onApplyTheme,
  onResetToDefault,
  onSaveCustomTheme,
}: StylePanelProps) {
  const { settings, updateEditorSetting } = useUserSettings()
  const {
    activeTab,
    setActiveTab,
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

  // Handle saving custom theme
  const handleSaveTheme = () => {
    if (!onSaveCustomTheme) return

    const themeConfig = onSaveCustomTheme(customThemeName)
    const savedTheme = saveAsLocalTheme(themeConfig.name, themeConfig)
    // Apply the newly saved theme
    onApplyTheme(savedTheme)
  }

  const elementGroups = [
    {
      title: 'Headings',
      elements: [
        { key: 'h1' as const, label: 'H1' },
        { key: 'h2' as const, label: 'H2' },
        { key: 'h3' as const, label: 'H3' },
        { key: 'h4' as const, label: 'H4' },
        { key: 'h5' as const, label: 'H5' },
        { key: 'h6' as const, label: 'H6' },
      ],
    },
    {
      title: 'Text',
      elements: [
        { key: 'p' as const, label: 'Paragraph' },
        { key: 'strong' as const, label: 'Bold' },
        { key: 'em' as const, label: 'Italic' },
        { key: 'a' as const, label: 'Link' },
        { key: 'blockquote' as const, label: 'Blockquote' },
      ],
    },
    {
      title: 'Lists',
      elements: [
        { key: 'ul' as const, label: 'Unordered List' },
        { key: 'ol' as const, label: 'Ordered List' },
        { key: 'li' as const, label: 'List Item' },
      ],
    },
    {
      title: 'Tables',
      elements: [
        { key: 'table' as const, label: 'Table' },
        { key: 'tr' as const, label: 'Row' },
        { key: 'th' as const, label: 'Header Cell' },
        { key: 'td' as const, label: 'Cell' },
      ],
    },
    {
      title: 'Media & Code',
      elements: [
        { key: 'img' as const, label: 'Image' },
        { key: 'code' as const, label: 'Inline Code' },
        { key: 'pre' as const, label: 'Code Block' },
      ],
    },
    {
      title: 'Container',
      elements: [
        { key: 'body' as const, label: 'Body' },
        { key: 'article' as const, label: 'Article' },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <TabButton
          active={activeTab === 'themes'}
          onClick={() => setActiveTab('themes')}
          icon={FaPalette}
          label="Themes"
        />
        <TabButton
          active={activeTab === 'advanced'}
          onClick={() => setActiveTab('advanced')}
          icon={FaCog}
          label="Advanced"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'themes' ? (
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
                    title={
                      isFavorite(currentTheme.id) ? 'Remove from favorites' : 'Add to favorites'
                    }
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
                    'isLocal' in theme && theme.isLocal
                      ? () => deleteLocalTheme(theme.id)
                      : undefined
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
        ) : (
          <>
            {/* Font Selection */}
            <CollapsibleSection title="Typography" defaultOpen={true}>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-700 dark:text-gray-300 text-sm mb-1.5 flex items-center gap-2">
                    <FaFont className="text-gray-500 dark:text-gray-400" />
                    Font Family
                  </label>
                  <select
                    value={fontConfig.fontFamily}
                    onChange={(e) => onFontConfigChange('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                    style={{ fontFamily: fontConfig.fontFamily }}
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  Preview:{' '}
                  <span style={{ fontFamily: fontConfig.fontFamily }}>
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              </div>
            </CollapsibleSection>

            {/* Tailwind Classes Configuration */}
            {elementGroups.map((group) => (
              <CollapsibleSection
                key={group.title}
                title={group.title}
                defaultOpen={group.title === 'Headings'}
              >
                {group.elements.map((element) => (
                  <TailwindClassInput
                    key={element.key}
                    label={element.label}
                    value={tailwindClasses[element.key]}
                    onChange={(value) => {
                      onTailwindClassChange(element.key, value)
                    }}
                  />
                ))}
              </CollapsibleSection>
            ))}

            {/* Behavior Configuration */}
            <CollapsibleSection title="Behavior" defaultOpen={false}>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.editor.openLinksInNewTab}
                    onChange={(e) => {
                      updateEditorSetting('openLinksInNewTab', e.target.checked)
                    }}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  Open links in new tab
                </label>
              </div>
            </CollapsibleSection>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">Tailwind Engine: JIT</span>
      </div>
    </div>
  )
}

export default StylePanel
