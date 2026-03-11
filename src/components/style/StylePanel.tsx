import { useState } from 'react'
import type { TailwindClasses, BehaviorConfig, FontConfig } from '../../types'
import { GOOGLE_FONTS } from '../../types'
import { TailwindClassInput } from './TailwindClassInput'
import { ThemeCardCompact } from '../themes/ThemeCardCompact'
import { useStyleSidebar } from '../../hooks/useStyleSidebar'
import { ThemePreset } from '../../data/themes.generated'
import {
  FaChevronDown,
  FaChevronRight,
  FaFont,
  FaPalette,
  FaCog,
  FaSearch,
  FaSave,
} from 'react-icons/fa'

interface StylePanelProps {
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
  fontConfig: FontConfig
  currentThemeId?: string
  onTailwindClassChange: (element: keyof TailwindClasses, value: string) => void
  onBehaviorConfigChange: <K extends keyof BehaviorConfig>(key: K, value: BehaviorConfig[K]) => void
  onFontConfigChange: <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => void
  onApplyTheme: (theme: ThemePreset) => void
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
  behaviorConfig,
  fontConfig,
  currentThemeId,
  onTailwindClassChange,
  onBehaviorConfigChange,
  onFontConfigChange,
  onApplyTheme,
}: StylePanelProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredThemes,
    saveAsLocalTheme,
    deleteLocalTheme,
  } = useStyleSidebar()

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveThemeName, setSaveThemeName] = useState('')

  const handleSaveTheme = () => {
    if (!saveThemeName.trim()) return
    saveAsLocalTheme(saveThemeName.trim(), {
      tailwindClasses,
      behaviorConfig,
      fontConfig,
      fontFamily: fontConfig.fontFamily,
    })
    setSaveThemeName('')
    setShowSaveDialog(false)
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

            {/* Save Current Theme Button */}
            {!showSaveDialog ? (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <FaSave className="text-xs" />
                Save current as theme
              </button>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 space-y-2">
                <input
                  type="text"
                  value={saveThemeName}
                  onChange={(e) => setSaveThemeName(e.target.value)}
                  placeholder="Theme name..."
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTheme()
                    if (e.key === 'Escape') setShowSaveDialog(false)
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTheme}
                    disabled={!saveThemeName.trim()}
                    className="flex-1 px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveDialog(false)
                      setSaveThemeName('')
                    }}
                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Theme Cards */}
            <div className="space-y-2">
              {filteredThemes.map((theme) => (
                <ThemeCardCompact
                  key={theme.id}
                  theme={theme}
                  isActive={currentThemeId === theme.id}
                  onApply={() => onApplyTheme(theme)}
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
                    checked={behaviorConfig.shouldOpenLinksInNewTab}
                    onChange={(e) => {
                      onBehaviorConfigChange('shouldOpenLinksInNewTab', e.target.checked)
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
