import { useState } from 'react'
import type { TailwindClasses, BehaviorConfig, FontConfig } from '../../types'
import { GOOGLE_FONTS } from '../../types'
import { TailwindClassInput } from './TailwindClassInput'
import { FaChevronDown, FaChevronRight, FaFont } from 'react-icons/fa'

interface StylePanelProps {
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
  fontConfig: FontConfig
  onTailwindClassChange: (element: keyof TailwindClasses, value: string) => void
  onBehaviorConfigChange: <K extends keyof BehaviorConfig>(key: K, value: BehaviorConfig[K]) => void
  onFontConfigChange: <K extends keyof FontConfig>(key: K, value: FontConfig[K]) => void
}

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
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

/**
 * Style configuration panel
 * Allows customization of Tailwind classes for each markdown element
 */
export function StylePanel({
  tailwindClasses,
  behaviorConfig,
  fontConfig,
  onTailwindClassChange,
  onBehaviorConfigChange,
  onFontConfigChange,
}: StylePanelProps) {
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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-b border-gray-200">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Styles</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Font Selection */}
        <CollapsibleSection title="Typography" defaultOpen={true}>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm mb-1.5 flex items-center gap-2">
                <FaFont className="text-gray-500" />
                Font Family
              </label>
              <select
                value={fontConfig.fontFamily}
                onChange={(e) => onFontConfigChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                style={{ fontFamily: fontConfig.fontFamily }}
              >
                {GOOGLE_FONTS.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
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
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={behaviorConfig.shouldOpenLinksInNewTab}
                onChange={(e) => {
                  onBehaviorConfigChange('shouldOpenLinksInNewTab', e.target.checked)
                }}
                className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
              />
              Open links in new tab
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={behaviorConfig.shouldShowLineNumbers}
                onChange={(e) => {
                  onBehaviorConfigChange('shouldShowLineNumbers', e.target.checked)
                }}
                className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
              />
              Show line numbers
            </label>
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-500">Tailwind Engine: JIT</span>
      </div>
    </div>
  )
}

export default StylePanel
